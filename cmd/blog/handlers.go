package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type indexPage struct {
	Title         string
	FeaturedPosts []*featuredPostData
	RecentPosts   []*recentPostData
}

type createPostRequest struct {
	Title         string `json:"title"`
	Subtitle      string `json:"subtitle"`
	Author        string `json:"author_name"`
	AuthorImg     string `json:"avatar"`
	AuthorImgName string `json:"avatar_name"`
	PublishDate   string `json:"publish_date"`
	Image         string `json:"image"`
	ImageName     string `json:"image_name"`
	Content       string `json:"content"`
}

type postData struct {
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	ImgModifier string `db:"image_url"`
	Content     string `db:"content"`
}

type featuredPostData struct {
	Title         string `db:"title"`
	Subtitle      string `db:"subtitle"`
	ImgModifier   string `db:"image_url"`
	CreatorsName  string `db:"author"`
	CreatorsImage string `db:"author_url"`
	PublishDate   string `db:"publish_date"`
	PostID        string `db:"post_id"`
	PostURL       string
}

type recentPostData struct {
	Title         string `db:"title"`
	Subtitle      string `db:"subtitle"`
	ImgModifier   string `db:"image_url"`
	CreatorsName  string `db:"author"`
	CreatorsImage string `db:"author_url"`
	PublishDate   string `db:"publish_date"`
	PostID        string `db:"post_id"`
	PostURL       string
}

func index(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := featuredPosts(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)
			return
		}

		recentPosts, err := recentPosts(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/index.html") // Главная страница блога
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err.Error())                    // Используем стандартный логгер для вывода ошбики в консоль
			return                                      // Не забываем завершить выполнение ф-ии
		}

		data := indexPage{
			Title:         "Escape",
			FeaturedPosts: posts,
			RecentPosts:   recentPosts,
		}

		err = ts.Execute(w, data) // Заставляем шаблонизатор вывести шаблон в тело ответа
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println("Request completed successfully")
	}
}

func login(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ts, err := template.ParseFiles("pages/login.html") // Главная страница блога
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)                            // Используем стандартный логгер для вывода ошбики в консоль
			return                                      // Не забываем завершить выполнение ф-ии
		}

		err = ts.Execute(w, nil) // Заставляем шаблонизатор вывести шаблон в тело ответа
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")
	}
}

func admin(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ts, err := template.ParseFiles("pages/admin.html") // Главная страница блога
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)                            // Используем стандартный логгер для вывода ошбики в консоль
			return                                      // Не забываем завершить выполнение ф-ии
		}

		err = ts.Execute(w, nil) // Заставляем шаблонизатор вывести шаблон в тело ответа
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")
	}
}

func post(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		postIDStr := mux.Vars(r)["postID"] // Получаем postID в виде строки из параметров урла

		postID, err := strconv.Atoi(postIDStr) // Конвертируем строку postID в число
		if err != nil {
			http.Error(w, "Invalid post id", http.StatusForbidden)
			log.Println(err)
			return
		}

		post, err := postByID(db, postID)
		if err != nil {
			if err == sql.ErrNoRows {
				// sql.ErrNoRows возвращается, когда в запросе к базе не было ничего найдено
				// В таком случае мы возвращем 404 (not found) и пишем в тело, что пост не найден
				http.Error(w, "Post not found", 404)
				log.Println(err)
				return
			}

			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/post.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		err = ts.Execute(w, post)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")

	}
}

func createPost(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		var req createPostRequest

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Internal Server Error Unmarshall", 500)
			log.Println(err.Error())
			return
		}

		var encodedAvatar = req.AuthorImg[strings.IndexByte(req.AuthorImg, ',')+1:]

		avatar, err := base64.StdEncoding.DecodeString(encodedAvatar)
		if err != nil {
			http.Error(w, "Internal Server Error avatar", 500)
			log.Println(err.Error())
			return
		}

		fileAvatar, err := os.Create("static/img/" + req.AuthorImgName) // создаем файл с именем переданным от фронта в папке static/img
		_, err = fileAvatar.Write(avatar)                               // Записываем контент картинки в файл

		var encodedImage = req.Image[strings.IndexByte(req.AuthorImg, ',')+1:]

		image, err := base64.StdEncoding.DecodeString(encodedImage)
		if err != nil {
			http.Error(w, "Internal Server Error image", 500)
			log.Println(err.Error())
			return
		}

		fileImage, err := os.Create("static/img/" + req.ImageName) // создаем файл с именем переданным от фронта в папке static/img
		_, err = fileImage.Write(image)                            // Записываем контент картинки в файл

		var newDate = req.PublishDate
		req.PublishDate = formatDate(newDate)

		err = savePost(db, req)
		if err != nil {
			http.Error(w, "Internal Server Error savepost", 500)
			log.Println(err.Error())
			return
		}

		return
		// log.Println("Request completed successfully")
	}
}

// Возвращаем не просто []postData, а []*postData - так у нас получится подставить PostURL в структуре

func featuredPosts(db *sqlx.DB) ([]*featuredPostData, error) {
	const query = `
		SELECT
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url,
			post_id
		FROM
			post
		WHERE featured = 1
	` // Составляем SQL-запрос для получения записей для секции featured-posts

	var posts []*featuredPostData // Заранее объявляем массив с результирующей информацией

	err := db.Select(&posts, query) // Делаем запрос в базу данных
	if err != nil {                 // Проверяем, что запрос в базу данных не завершился с ошибкой
		return nil, err
	}

	for _, post := range posts {
		post.PostURL = "/post/" + post.PostID // Формируем исходя из ID пост в базе
	}

	fmt.Println(posts)

	return posts, nil
}

func recentPosts(db *sqlx.DB) ([]*recentPostData, error) {
	const query = `
		SELECT
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url,
			post_id
		FROM
			post
		WHERE featured = 0
	` // Составляем SQL-запрос для получения записей для секции recent-posts

	var recentPosts []*recentPostData // Заранее объявляем массив с результирующей информацией

	err := db.Select(&recentPosts, query) // Делаем запрос в базу данных
	if err != nil {
		return nil, err
	}

	for _, post := range recentPosts {
		post.PostURL = "/post/" + post.PostID // Формируем исходя из ID ордера в базе
	}

	fmt.Println(recentPosts)

	return recentPosts, nil
}

// Получает информацию о конкретном посте из базы данных
func postByID(db *sqlx.DB, postID int) (postData, error) {
	const query = `
		SELECT
			title,
			subtitle,
			image_url,
			content
		FROM
			post
		WHERE
			post_id = ?
	`
	// В SQL-запросе добавились параметры, как в шаблоне. ? означает параметр, который мы передаем в запрос ниже

	var post postData

	err := db.Get(&post, query, postID)
	if err != nil {
		return postData{}, err
	}

	return post, nil
}

func savePost(db *sqlx.DB, req createPostRequest) error {
	const query = `
		INSERT INTO
			post
		(
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url,
			content
		)
		VALUES
		(
			?,
			?,
			?,
			CONCAT('static/img/', ?),
			?,
			CONCAT('static/img/', ?),
			?
		)
	`

	//CONCAT('static/img/', ?),

	_, err := db.Exec(query, req.Title, req.Subtitle, req.Author, req.AuthorImgName, req.PublishDate, req.ImageName, req.Content)
	return err
}

func formatDate(oldDate string) string {
	dateStr := strings.Split(oldDate, "-")
	newDateStr := dateStr[2] + "/" + dateStr[1] + "/" + dateStr[0]
	return newDateStr
}

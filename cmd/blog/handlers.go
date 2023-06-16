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
	"time"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

const (
	authCookieName = "auth"
)

type indexPage struct {
	Title         string
	FeaturedPosts []*featuredPostData
	RecentPosts   []*recentPostData
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type user struct {
	UserID int    `db:"user_id"`
	Email  string `db:"email"`
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

func loginPage(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
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

func login(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		var field loginRequest

		err = json.Unmarshal(userData, &field)
		if err != nil {
			http.Error(w, "Internal Server Error Unmarshall", 500)
			log.Println(err.Error())
			return
		}

		user, err := userByEmailAndPassword(db, field.Email, field.Password)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Incorrect password or email!", 401)
				return
			}
			http.Error(w, "Internal Server Error (user)", 500)
			log.Println(err.Error())
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:    authCookieName,
			Value:   fmt.Sprint(user.UserID),
			Path:    "/",
			Expires: time.Now().AddDate(0, 0, 1),
		})

		w.WriteHeader(200)

		log.Println("Request completed successfully")
	}
}

func logout() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:    authCookieName, // Устанавливаем имя куки, которую нужно удалить
			Path:    "/",
			Expires: time.Now().AddDate(0, 0, -1), // Выставляем дату протухания в “прошлом”
		})

		log.Println("Request completed successfully")
	}
}

func admin(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := authByCookie(db, w, r) //проверка на куки
		if err != nil {
			return
		}

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

		postData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", 501)
			log.Println(err)
			return
		}

		var field createPostRequest
		err = json.Unmarshal(postData, &field)
		if err != nil {
			http.Error(w, "Internal Server Error Unmarshall", 502)
			log.Println(err.Error())
			return
		}

		var encodedAvatar = field.AuthorImg[strings.IndexByte(field.AuthorImg, ',')+1:]

		avatar, err := base64.StdEncoding.DecodeString(encodedAvatar)
		if err != nil {
			http.Error(w, "Internal Server Error (avatar not decoded)", 503)
			log.Println(err.Error())
			return
		}

		fileAvatar, err := os.Create("static/img/" + field.AuthorImgName) // создаем файл с именем переданным от фронта в папке static/img
		_, err = fileAvatar.Write(avatar)                                 // Записываем контент картинки в файл
		if err != nil {
			http.Error(w, "Internal Server Error (no wrote avatar in file)", 504)
			log.Println(err.Error())
			return
		}

		var encodedImage = field.Image[strings.IndexByte(field.AuthorImg, ',')+1:]

		image, err := base64.StdEncoding.DecodeString(encodedImage)
		if err != nil {
			http.Error(w, "Internal Server Error (post image not decoded)", 505)
			log.Println(err.Error())
			return
		}

		fileImage, err := os.Create("static/img/" + field.ImageName) // создаем файл с именем переданным от фронта в папке static/img
		_, err = fileImage.Write(image)                              // Записываем контент картинки в файл
		if err != nil {
			http.Error(w, "Internal Server Error (no wrote post-image in file)", 506)
			log.Println(err.Error())
			return
		}

		err = savePost(db, field)
		if err != nil {
			http.Error(w, "Internal Server Error (savepost)", 507)
			log.Println(err.Error())
			return
		}

		return

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

func savePost(db *sqlx.DB, field createPostRequest) error {
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

	_, err := db.Exec(query, field.Title, field.Subtitle, field.Author, field.AuthorImgName, field.PublishDate, field.ImageName, field.Content)
	return err
}

func formatDate(oldDate string) string {
	dateStr := strings.Split(oldDate, "-")
	newDateStr := dateStr[2] + "/" + dateStr[1] + "/" + dateStr[0]
	return newDateStr
}

func authByCookie(db *sqlx.DB, w http.ResponseWriter, r *http.Request) error {
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		if err == http.ErrNoCookie {
			http.Error(w, "No auth cookie passed", 401)
			log.Println(err)
			return err
		}
		http.Error(w, "Internal Server Error", 500)
		return err
	}

	userIDStr := cookie.Value

	userID, err := strconv.Atoi(userIDStr) // conv str to int
	if err != nil {
		http.Error(w, "Invalid user id", 403)
		log.Println(err)
		return err
	}

	_, err = userByID(db, userID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "USer not found!", 403)
			log.Println(err)
			return err
		}
		http.Error(w, "Internal server error", 500)
		log.Println(err)
		return err
	}

	return nil
}

func userByEmailAndPassword(db *sqlx.DB, email, password string) (user, error) {
	const query = `
	SELECT
		user_id,
		email
	FROM user	
	WHERE email = ? AND password = ?
	`
	var u user

	err := db.Get(&u, query, email, password)
	if err != nil {
		return user{}, err
	}

	return u, nil
}

func userByID(db *sqlx.DB, userID int) (user, error) {
	const query = `
	SELECT
		user_id,
		email
	FROM user	
	WHERE user_id = ?
	`
	var u user

	err := db.Get(&u, query, userID)
	if err != nil {
		return user{}, err
	}

	return u, nil
}

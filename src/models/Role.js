class Notice {
    constructor(title, body, date, author, subject, id = null) {
        this.title = title;
        this.body = body;
        this.date = date;
        this.author = author;
        this.subject = subject;
        this.id = id;
    }
}

module.exports = Notice;

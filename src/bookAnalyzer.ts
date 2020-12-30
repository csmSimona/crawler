import cheerio from 'cheerio';

interface Book {
    url: string | undefined,
    title: string | undefined,
    author: string | undefined
}

export default class BookAnalyzer {
    private static instance: BookAnalyzer;
    static getInstance() {
        if (!this.instance) {
            this.instance = new BookAnalyzer();
        }
        return this.instance;
    }
    
    private getBookInfo(html: string) {
        const $ = cheerio.load(html);
        const bookItems = $('.subject-item');
        const bookInfos: Book[] = [];
        bookItems.map((index, element) => {
            const pic = $(element).find(".pic");
            const info = $(element).find(".info");
            const url = pic.find("img").attr('src');
            const title = info.find("a").attr('title');
            const desc = info.find(".pub").eq(0).text();
            const author = desc.split('/')[0].replace(/[\r\n]/g, "").trim();
            bookInfos.push({url, title, author})
        })
        return bookInfos;
    }

    public analyze(html: string) {
        let info = this.getBookInfo(html)
        return JSON.stringify(info);
    }
}
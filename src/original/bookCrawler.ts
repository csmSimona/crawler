import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Book {
    url: string | undefined,
    title: string | undefined,
    author: string | undefined
}

class BookCrawler {
    private filePath = path.resolve(__dirname, '../../data/books.json');

    getBookInfo(html: string) {
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

    writeToJSON(bookInfos: Book[]) {
        let fileContent: Book[] = [];
        if (fs.existsSync(this.filePath)) {
            fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        }
        return fileContent.concat(bookInfos)
    }

    async getRawHtml(start: number) {
        // 我的想读
        let url = 'https://book.douban.com/people/146987781/wish?start=' + start + '&sort=time&rating=all&filter=all&mode=grid';
        const result = await superagent.get(url).set('Cookie', 'bid=D9aIHksML6I; ll="118172"; viewed="27132345"; gr_user_id=88f33924-4390-4707-af8d-1cd5e134fcc3; _vwo_uuid_v2=D4251A257F55CBA9421F12B50176D0708|bd9e0d41c24b90e02b37a42950b59f89; __gads=ID=a896368a285ea830-22f63b4c5ac500fe:T=1609141476:RT=1609141476:S=ALNI_Ma4gesA7757-SZRdTLQ_HmvLslZ6w; push_noty_num=0; push_doumail_num=0; douban-profile-remind=1; __utmv=30149280.14698; dbcl2="146987781:PAejJjaalvE"; ck=7Ona; __utma=30149280.31598415.1600158693.1609227259.1609292281.10; __utmc=30149280; __utmz=30149280.1609292281.10.2.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt_douban=1; __utmb=30149280.5.10.1609292281');
        const bookInfos = this.getBookInfo(result.text);
        const books = this.writeToJSON(bookInfos);
        fs.writeFileSync(this.filePath, JSON.stringify(books));
        if (bookInfos.length != 0) {
            start = start + 15;
            setTimeout(() => {
                this.getRawHtml(start);
            }, 500)
        }
    }

    constructor() {
        this.getRawHtml(0);
    }
}

let bookCrawler = new BookCrawler();
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Read {
    url: string | undefined,
    title: string | undefined,
    author: string | undefined,
    rate: string | undefined,
    date: string | undefined,
    tags: string | undefined,
    comment: string | undefined
}

class ReadCrawler {
    private filePath = path.resolve(__dirname, '../data/read.json');
    // private filePath = path.resolve(__dirname, '../data/read1.json');

    getBookInfo(html: string) {
        const $ = cheerio.load(html);
        const bookItems = $('.subject-item');
        const bookInfos: Read[] = [];
        bookItems.map((index, element) => {
            const pic = $(element).find(".pic");
            const info = $(element).find(".info");
            const url = pic.find("img").attr('src');
            const title = info.find("a").attr('title');
            const desc = info.find(".pub").eq(0).text();
            const author = desc.split('/')[0].replace(/[\r\n]/g, "").trim();
            const date = info.find(".date").eq(0).text().replace(/[\r\n]/g, "").trim();
            const tags = info.find(".tags").eq(0).text();
            const comment = info.find(".comment").eq(0).text().replace(/[\r\n]/g, "");
            const rateClass = info.find(".short-note").find("span").eq(0).attr('class');
            let rate;
            switch(rateClass) {
                case 'rating1-t':
                    rate = '⭐';
                    break;
                case 'rating2-t':
                    rate = '⭐⭐';
                    break;
                case 'rating3-t':
                    rate = '⭐⭐⭐';
                    break;
                case 'rating4-t':
                    rate = '⭐⭐⭐⭐';
                    break;
                case 'rating5-t':
                    rate = '⭐⭐⭐⭐⭐';
                    break;
            }
            bookInfos.push({url, title, author, rate, date, tags, comment})
        })
        return bookInfos;
    }

    writeToJSON(bookInfos: Read[]) {
        let fileContent: Read[] = [];
        if (fs.existsSync(this.filePath)) {
            fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        }
        return fileContent.concat(bookInfos)
    }

    async getRawHtml(start: number) {
        // 我的已读
        let url = 'https://book.douban.com/people/146987781/collect?start=' + start + '&sort=time&rating=all&filter=all&mode=grid';
        const result = await superagent.get(url).set('Referer', 'https://book.douban.com/');

        const bookInfos = this.getBookInfo(result.text);
        const books = this.writeToJSON(bookInfos);
        fs.writeFileSync(this.filePath, JSON.stringify(books));
        if (bookInfos.length != 0) {
            start = start + 15;
            this.getRawHtml(start);
        }
    }

    constructor() {
        this.getRawHtml(0);
    }
}

let readCrawler = new ReadCrawler();
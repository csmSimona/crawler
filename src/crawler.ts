import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import BookAnalyzer from './bookAnalyzer';
import ReadAnalyzer from './readAnalyzer';
import MovieAnalyzer from './movieAnalyzer';

export interface Analyzer {
    analyze: (html: string) => string;
}

class Crawler {
    writeToJSON(infos: string) {
        let fileContent: string[] = [];
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        return fileContent.concat(JSON.parse(infos))
    }
    
    async getRawHtml(start: number) {
        let url = `${indexUrl}?start=${start}&sort=time&rating=all&filter=all&mode=grid`;
        const result = await superagent.get(url).set('Referer', refer).set('Cookie', cookie);
        return result.text
    }

    async init(start: number) {
        const html = await this.getRawHtml(start);
        const infos = this.analyzer.analyze(html);
        const books = this.writeToJSON(infos);
        fs.writeFileSync(filePath, JSON.stringify(books));
        // if (JSON.parse(infos).length != 0) {
        //     start = start + 15;
        //     setTimeout(() => {
        //         this.init(start);
        //     }, 500)
        // }
    }

    constructor(private analyzer: Analyzer) {
        this.init(0);
    }
}

const refer = 'https://book.douban.com/';
// const refer = 'https://movie.douban.com/people/146987781/wish';
const cookie = 'bid=D9aIHksML6I; ll="118172"; viewed="27132345"; gr_user_id=88f33924-4390-4707-af8d-1cd5e134fcc3; _vwo_uuid_v2=D4251A257F55CBA9421F12B50176D0708|bd9e0d41c24b90e02b37a42950b59f89; __gads=ID=a896368a285ea830-22f63b4c5ac500fe:T=1609141476:RT=1609141476:S=ALNI_Ma4gesA7757-SZRdTLQ_HmvLslZ6w; push_noty_num=0; push_doumail_num=0; douban-profile-remind=1; __utmv=30149280.14698; dbcl2="146987781:PAejJjaalvE"; ck=7Ona; __utma=30149280.31598415.1600158693.1609227259.1609292281.10; __utmc=30149280; __utmz=30149280.1609292281.10.2.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; ap_v=0,6.0; __utmt_douban=1; __utmt=1; __utmb=30149280.13.10.1609292281';

// 写入文件地址
const filePath = path.resolve(__dirname, '../data/books.json');
// const filePath = path.resolve(__dirname, '../data/read.json');
// const filePath = path.resolve(__dirname, '../data/movie.json');
// 爬虫网址
const indexUrl = 'https://book.douban.com/people/146987781/wish';
// const indexUrl = 'https://book.douban.com/people/146987781/collect';
// const indexUrl = 'https://movie.douban.com/people/146987781/wish';


// 豆瓣想读书籍列表
let bookAnalyzer = BookAnalyzer.getInstance();
// 豆瓣已读书籍列表
// let readAnalyzer = ReadAnalyzer.getInstance();
// 豆瓣想看电影列表
// let movieAnalyzer = MovieAnalyzer.getInstance();

let crawler = new Crawler(bookAnalyzer);
// let crawler = new Crawler(readAnalyzer);
// let crawler = new Crawler(movieAnalyzer);
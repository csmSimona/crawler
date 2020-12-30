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

export default class ReadAnalyzer {
    private static instance: ReadAnalyzer;
    static getInstance() {
        if (!this.instance) {
            this.instance = new ReadAnalyzer();
        }
        return this.instance;
    }

    private getReadInfo(html: string) {
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

    public analyze(html: string) {
        let info = this.getReadInfo(html)
        return JSON.stringify(info);
    }
}
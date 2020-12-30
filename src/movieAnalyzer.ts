import cheerio from 'cheerio';

interface Movie {
    url: string | undefined,
    title: string | undefined,
    intro: string | undefined
}

export default class MovieAnalyzer {
    private static instance: MovieAnalyzer;
    static getInstance() {
        if (!this.instance) {
            this.instance = new MovieAnalyzer();
        }
        return this.instance;
    }
    
    private getMovieInfo(html: string) {
        const $ = cheerio.load(html);
        const movieItems = $('.subject-item');
        const movieInfos: Movie[] = [];
        movieItems.map((index, element) => {
            const pic = $(element).find(".pic");
            const info = $(element).find(".info");
            const url = pic.find("img").attr('src');
            const title = info.find(".title").find("a").eq(0).text();
            const desc = info.find(".intro").eq(0).text();
            // const intro = desc.split('/')[0].replace(/[\r\n]/g, "").trim();
            movieInfos.push({url, title, intro: desc})
        })
        return movieInfos;
    }

    public analyze(html: string) {
        let info = this.getMovieInfo(html)
        return JSON.stringify(info);
    }
}
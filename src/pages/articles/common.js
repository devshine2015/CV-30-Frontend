const youtubeRegex = /^(http(s)??:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
const vimeoRegex = /^(http(s)??:\/\/)?(player\.)?(vimeo\.com)(\/video)?(\/)([0-9])+/;

export const testVideoUrlValid = videoUrl => {
    return videoUrl && (youtubeRegex.test(videoUrl) || vimeoRegex.test(videoUrl));
}

export const getFroalaInsertStringFromVideoUrl = videoUrl => {
    let embedVideoUrl = videoUrl;
    switch (true) {
        case (youtubeRegex.test(embedVideoUrl)):
            embedVideoUrl = embedVideoUrl.replace("watch?v=", "embed/")
            break;
        case (vimeoRegex.test(embedVideoUrl)):
            embedVideoUrl = embedVideoUrl.replace("//vimeo.com/", "//player.vimeo.com/");
            const endMatch = /(?<!video)(\/)([0-9])+/.exec(embedVideoUrl);
            if (endMatch) {
                embedVideoUrl = embedVideoUrl.slice(0, endMatch.index) + "/video" + embedVideoUrl.slice(endMatch.index);
            }
            break;
        default:
            break;
    }

    return `<iframe width="560" height="315" src="${embedVideoUrl}" frameborder="0" allowfullscreen></iframe>`;
}
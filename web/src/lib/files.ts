type FileType = {
    ext: string[],
    format: string,
    icon: string,
    category: string,
}

const fileTypes: FileType[] = [
    {
        ext: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg", "jfif", "pjpeg", "pjp", "tif", "tiff", "heic", "heif"],
        format: "image",
        icon: "image",
        category: "Images"
    },
    {
        ext: ["mp4", "webm", "avi", "mkv", "flv", "mov"],
        format: "video",
        icon: "movie",
        category: "Videos"
    },
    {
        ext: ["mp3", "wav", "flac", "ogg", "m4a"],
        format: "audio",
        icon: "music_note",
        category: "Music"
    },
    {
        ext: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "rtf", "ttf"],
        format: "binary",
        icon: "description",
        category: "Documents"
    },
    {
        ext: ["zip", "rar", "7z", "tar", "gz", "xz", "bz2", "rar4"],
        format: "binary",
        icon: "package",
        category: "Archives"
    },
    {
        ext: [
            "js", "ts", "jsx", "tsx", "json", "html", "css", "scss", "pcss", "postcss", "htmx", "xml",
            "yaml", "yml", "toml", "ini", "cfg", "conf", "go", "gitignore", "log", "vue", "svelte",
            "py", "pyw", "java", "c", "cpp", "h", "hpp", "cs", "rs", "rb", "php", "sh", "bash", "zsh",
            "ps1", "psm1", "bat", "cmd", "vbs", "vba", "vb", "vbe", "vbscript", "lua", "pl", "perl",
            "sh", "kt", "kts", "kotlin", "swift", "mcfunction", "mcmeta", "jsonc", "tsconfig", "jsconfig",
            "md", "markdown", "txt",
        ],
        format: "text",
        icon: "code_blocks",
        category: "Code"
    },
    {
        ext: [
            "jar", "class", "exe", "msi", "apk", "app", "dmg", "pkg", "dat", "bin", "iso", "img", "ovpn", "ahk", "db", "sqlite",
            "sql", "csv", "tsv", "pyc", "dll", "dylib", "so", "lib", "a", "o", "obj", "pdb", "ipynb", "whl", "egg", "deb", "rpm",
        ],
        format: "binary",
        icon: "code_blocks",
        category: "Code"
    }
]

const getFileType = (fileName: string): FileType => {
    for (let i = 0; i < fileTypes.length; i++) {
        const type = fileTypes[i];
        for (let j = 0; j < type.ext.length; j++) {
            if (fileName.endsWith("." + type.ext[j])) {
                return type;
            }
        }
    }
    return {
        ext: ["*"],
        icon: "draft",
        format: "file",
        category: "Other"
    };
}

const getFileExtension = (fileName: string): string => {
    return fileName.split(".").pop() || "";
}

function getCategoryIcon(catName: string): string {
    switch (catName) {
        case "Images":
            return "image";
        case "Videos":
            return "movie";
        case "Music":
            return "music_note";
        case "Documents":
            return "description";
        case "Archives":
            return "package";
        case "Code":
            return "code_blocks";
        default:
            return "draft";
    }
}

export {
    type FileType,

    fileTypes,
    getFileType,
    getFileExtension,
    getCategoryIcon
}
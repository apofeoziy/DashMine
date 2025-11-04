const PREDEFINED = require("./predefined");
const CORES_URL_GEN = require("./coresURLGenerator");

// Функция для получения списка версий ядра
exports.getCoreVersions = (core, cb) => {
    if (typeof PREDEFINED.SERVER_CORES[core] !== "undefined") {
        let coreItem = PREDEFINED.SERVER_CORES[core];
        switch (coreItem.versionsMethod) {
            case "externalURL":
                CORES_URL_GEN.getAllCoresByExternalURL(coreItem.versionsUrl, cb);
                break;
            case "paper":
                CORES_URL_GEN.getAllPaperLikeCores(cb, coreItem.name);
                break;
            case "purpur":
                CORES_URL_GEN.getAllPurpurCores(cb);
                break;
            case "magma":
                CORES_URL_GEN.getAllMagmaCores(cb);
                break;
            default:
                cb(false);
                break;
        }
    } else {
        cb(false);
    }
};

exports.getCoreVersionURL = (core, version, cb) => {
    if (typeof PREDEFINED.SERVER_CORES[core] !== "undefined" && version !== "undefined") {
        let coreItem = PREDEFINED.SERVER_CORES[core];
        switch (coreItem.urlGetMethod) {
            case "externalURL":
                CORES_URL_GEN.getCoreByExternalURL(coreItem.versionsUrl, version, (url) => {
                    if (url === false) {
                        cb(false);
                    } else {
                        // For externalURL, we only have URL, so generate filename
                        let filename = core + "-" + version + ".jar";
                        cb({ url: url, filename: filename });
                    }
                });
                break;
            case "paper":
                CORES_URL_GEN.getPaperCoreURL(coreItem.name, version, cb);
                break;
            case "purpur":
                CORES_URL_GEN.getPurpurCoreURL(version, (url) => {
                    if (url === false) {
                        cb(false);
                    } else {
                        let filename = "purpur-" + version + ".jar";
                        cb({ url: url, filename: filename });
                    }
                });
                break;
            case "magma":
                CORES_URL_GEN.getMagmaCoreURL(version, (url) => {
                    if (url === false) {
                        cb(false);
                    } else {
                        let filename = "magma-" + version + ".jar";
                        cb({ url: url, filename: filename });
                    }
                });
                break;
            default:
                cb(false);
                break;
        }
    } else {
        cb(false);
    }
};

// Функция для получения списка ядер
exports.getCoresList = () => {
    return PREDEFINED.SERVER_CORES;
};
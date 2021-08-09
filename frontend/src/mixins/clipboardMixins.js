

export const clipboardMixins = {
    methods: {
        fallbackCopyTextToClipboard(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;

            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            var result = false;
            try {

                result = document.execCommand('copy');
            } catch (err) {
                document.body.removeChild(textArea);
                result = false;
            }

            document.body.removeChild(textArea);
            return result;
        },
        copyTextToClipboard(text) {
            return new Promise((resolve, reject) => {
                if (!navigator.clipboard) {
                    resolve(this.fallbackCopyTextToClipboard(text));
                }
                navigator.clipboard.writeText(text).then(function () {
                    resolve(true);
                }, function (err) {
                    reject(err)
                });
            })

        }
    }
};




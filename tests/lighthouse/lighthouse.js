module.exports = {
    ci: {
        collect: {
            url: [
                "http://localhost:8080/tests/example/dummy"
            ],
            numberOfRuns: 3,
            headful: false,
            settings: {
                disableStorageReset: true,
                preset: "desktop"
            },
        },
        upload: {
            target: "filesystem",
            outputDir: "./tests/lighthouse/reports"
        },
        assert: {
            preset: "lighthouse:recommended",
            assertions: {
                "errors-in-console": "off",
                "network-dependency-tree-insight": "off",
                "unminified-css": "off",
                "uses-text-compression": "off",
                "unused-javascript": "off"
            }
        }
    }
}

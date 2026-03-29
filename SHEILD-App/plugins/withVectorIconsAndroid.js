const fs = require("fs");
const path = require("path");
const {
  withAppBuildGradle,
  withDangerousMod,
} = require("expo/config-plugins");

const FONT_GRADLE_LINE =
  'apply from: "../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/fonts.gradle"';
const VECTOR_ICONS_CONFIG = `project.ext.vectoricons = [
    iconFontNames: ["__vector_icons_disabled__.ttf"]
]`;
const VECTOR_ICONS_TASK_FIX = `afterEvaluate {
    def vectorIconsCopyTask = tasks.findByName("copyReactNativeVectorIconFonts")
    def lintVitalReportTask = tasks.findByName("generateReleaseLintVitalReportModel")

    if (vectorIconsCopyTask != null && lintVitalReportTask != null) {
        lintVitalReportTask.dependsOn(vectorIconsCopyTask)
    }
}`;

function syncVectorIconFonts(projectRoot) {
  const sourceDir = path.join(
    projectRoot,
    "node_modules",
    "react-native-vector-icons",
    "Fonts"
  );
  const targetDir = path.join(
    projectRoot,
    "android",
    "app",
    "src",
    "main",
    "assets",
    "fonts"
  );

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Vector icon fonts not found at ${sourceDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir)) {
    if (entry.endsWith(".ttf")) {
      fs.copyFileSync(path.join(sourceDir, entry), path.join(targetDir, entry));
    }
  }
}

module.exports = function withVectorIconsAndroid(config) {
  config = withAppBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes(VECTOR_ICONS_CONFIG)) {
      config.modResults.contents = `${config.modResults.contents.trim()}\n\n${VECTOR_ICONS_CONFIG}\n`;
    }

    if (!config.modResults.contents.includes(FONT_GRADLE_LINE)) {
      config.modResults.contents = `${config.modResults.contents.trim()}\n\n${FONT_GRADLE_LINE}\n`;
    }

    if (!config.modResults.contents.includes(VECTOR_ICONS_TASK_FIX)) {
      config.modResults.contents = `${config.modResults.contents.trim()}\n\n${VECTOR_ICONS_TASK_FIX}\n`;
    }

    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      syncVectorIconFonts(config.modRequest.projectRoot);
      return config;
    },
  ]);

  return config;
};

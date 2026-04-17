import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const isEASBuild = process.env.EAS_BUILD === "true";

  // During EAS native builds, strip the UUID-based baseUrl from experiments.
  // The dev-preview baseUrl (e.g. "/541294b6-.../dev-preview/") is required for
  // web preview routing but causes Android Gradle failures at
  // :app:mergeReleaseResources because Android resource names must start with a
  // letter, and the UUID prefix starts with a digit.
  if (isEASBuild && config.experiments?.baseUrl) {
    const { baseUrl, ...restExperiments } = config.experiments as Record<
      string,
      unknown
    >;
    config.experiments = restExperiments as ExpoConfig["experiments"];
  }

  return config as ExpoConfig;
};

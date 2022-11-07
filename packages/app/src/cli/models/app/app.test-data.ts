import {App, AppInterface} from './app.js'
import {FunctionExtension, ThemeExtension, UIExtension} from './extensions.js'

export function testApp(app: Partial<AppInterface> = {}): AppInterface {
  const newApp = new App(
    app.name ?? 'App',
    app.idEnvironmentVariableName ?? 'SHOPIFY_API_KEY',
    app.directory ?? '/tmp/project',
    app.packageManager ?? 'yarn',
    app.configuration ?? {scopes: '', extensionDirectories: []},
    app.configurationPath ?? '/tmp/project/shopify.app.toml',
    app.nodeDependencies ?? {},
    app.webs ?? [],
    app.extensions?.ui ?? [],
    app.extensions?.theme ?? [],
    app.extensions?.function ?? [],
    app.usesWorkspaces ?? false,
    app.dotenv,
    app.errors,
  )
  if (app.updateDependencies) {
    Object.getPrototypeOf(newApp).updateDependencies = app.updateDependencies
  }
  if (app.hasUIExtensions) {
    Object.getPrototypeOf(newApp).hasUIExtensions = app.hasUIExtensions
  }
  return newApp
}

export function testUIExtension(uiExtension: Partial<UIExtension> = {}): UIExtension {
  const directory = uiExtension?.directory ?? '/tmp/project/extensions/test-ui-extension'

  return {
    identifier: uiExtension?.configuration?.type ?? 'product_subscription',
    name: uiExtension?.configuration?.name ?? 'test-ui-extension',
    localIdentifier: uiExtension?.localIdentifier ?? 'test-ui-extension',
    outputBundlePath: uiExtension?.outputBundlePath ?? `${directory}/dist/main.js`,
    configuration: uiExtension?.configuration ?? {
      name: uiExtension?.configuration?.name ?? 'test-ui-extension',
      type: uiExtension?.configuration?.type ?? 'product_subscription',
      metafields: [],
      capabilities: {
        block_progress: false,
        network_access: false,
      },
    },
    type: 'checkout_post_purchase',
    configurationPath: uiExtension?.configurationPath ?? `${directory}/shopify.ui.extension.toml`,
    directory,
    entrySourceFilePath: uiExtension?.entrySourceFilePath ?? `${directory}/src/index.js`,
    idEnvironmentVariableName: uiExtension?.idEnvironmentVariableName ?? 'SHOPIFY_TET_UI_EXTENSION_ID',
    devUUID: 'devUUID',
    publishURL: () => {
      return new Promise((resolve, reject) => resolve("app's publish url"))
    },
    deployConfig() {
      return new Promise((resolve, reject) => resolve({}))
    },
  }
}

export function testThemeExtensions(): ThemeExtension {
  return {
    identifier: 'theme_app_extension',
    name: 'theme extension name',
    configuration: {
      name: 'theme extension name',
      type: 'theme',
    },
    idEnvironmentVariableName: '',
    localIdentifier: 'extension title',
    configurationPath: '',
    directory: './my-extension',
    type: 'theme',
    publishURL: () => {
      return new Promise((resolve, reject) => resolve("app's publish url"))
    },
  }
}

export function testFunctionExtension(): FunctionExtension {
  return {
    name: 'test function extension',
    identifier: 'product_discounts',
    configuration: {
      name: 'test function extension',
      description: 'description',
      type: 'product_discounts',
      build: {
        command: 'echo "hello world"',
      },
      apiVersion: '2022-07',
      configurationUi: true,
    },
    buildWasmPath: () => '',
    inputQueryPath: () => '',
    metadata: {
      schemaVersions: {},
    },
    idEnvironmentVariableName: '',
    localIdentifier: 'extension title',
    configurationPath: '',
    directory: './my-extension',
    type: 'product_discounts',
    publishURL: () => {
      return new Promise((resolve, reject) => resolve("app's publish url"))
    },
  }
}

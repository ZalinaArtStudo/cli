import {createExtensionSpec} from '../extensions.js'
import {BaseExtensionSchema, NewExtensionPointsSchema} from '../schemas.js'
import {loadLocalesConfig} from '../../../utilities/extensions/locales-configuration.js'
import {schema} from '@shopify/cli-kit'

const UIExtensionSchema = BaseExtensionSchema.extend({
  name: schema.define.string(),
  type: schema.define.literal('ui_extension').default('ui_extension'),
  extensionPoints: NewExtensionPointsSchema,
  settings: schema.define.string().optional(),
})

const spec = createExtensionSpec({
  identifier: 'checkout_ui_extension_beta',
  externalIdentifier: 'checkout_ui_beta',
  externalName: 'Checkout UI Beta',
  surface: 'checkout',
  dependency: {name: '@shopify/checkout-ui-extensions-react', version: '^0.20.0'},
  partnersWebId: 'ui_extension',
  schema: UIExtensionSchema,
  deployConfig: async (config, directory) => {
    return {
      extension_points: config.extensionPoints,
      capabilities: config.capabilities,
      metafields: config.metafields,
      name: config.name,
      settings: config.settings,
      localization: await loadLocalesConfig(directory, config.name),
    }
  },
})

export default spec

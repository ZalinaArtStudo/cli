import ConcurrentOutput from '../../private/node/ui/components/ConcurrentOutput.js'
import {OutputProcess} from '../../output.js'
import {render} from '../../private/node/ui.js'
import {Fatal} from '../../error.js'
import {alert} from '../../private/node/ui/alert.js'
import {fatalError} from '../../private/node/ui/error.js'
import {AlertProps} from '../../private/node/ui/components/Alert.js'
import {Progress, ProgressProps} from '../../private/node/ui/components/Progress.js'
import React from 'react'
import {AbortController} from 'abort-controller'

interface RenderConcurrentOptions {
  processes: OutputProcess[]
  abortController?: AbortController
  showTimestamps?: boolean
}

/**
 * Renders output from concurrent processes to the terminal with {@link ConcurrentOutput}.
 */
export async function renderConcurrent({processes, abortController, showTimestamps = true}: RenderConcurrentOptions) {
  const {waitUntilExit} = render(
    <ConcurrentOutput
      processes={processes}
      abortController={abortController ?? new AbortController()}
      showTimestamps={showTimestamps}
    />,
  )

  return waitUntilExit()
}

type RenderAlertOptions = Omit<AlertProps, 'type'>

/**
 * Renders an information banner to the console.
 *
 * Basic:
 *
 * ```
 * ╭─ info ───────────────────────────────────────────────────╮
 * │                                                          │
 * │  Body                                                    │
 * │                                                          │
 * ╰──────────────────────────────────────────────────────────╯
 * ```
 *
 * Complete:
 * ```
 * ╭─ info ───────────────────────────────────────────────────╮
 * │                                                          │
 * │  Title                                                   │
 * │                                                          │
 * │  Body                                                    │
 * │                                                          │
 * │  Next steps                                              │
 * │    • Run `cd santorini-goods`                            │
 * │    • To preview your project, run `npm app dev`          │
 * │    • To add extensions, run `npm generate extension`     │
 * │                                                          │
 * │  Reference                                               │
 * │    • Run `npm shopify help`                              │
 * │    • Press 'return' to open the dev docs:                │
 * │      https://shopify.dev                                 │
 * │                                                          │
 * │  Link: https://shopify.com                               │
 * │                                                          │
 * ╰──────────────────────────────────────────────────────────╯
 * ```
 */
export function renderInfo(options: RenderAlertOptions) {
  alert({...options, type: 'info'})
}

/**
 * Renders a success banner to the console.
 *
 * Basic:
 *
 * ```
 * ╭─ success ────────────────────────────────────────────────╮
 * │                                                          │
 * │  Title                                                   │
 * │                                                          │
 * ╰──────────────────────────────────────────────────────────╯
 * ```
 *
 * Complete:
 * ```
 * ╭─ success ────────────────────────────────────────────────╮
 * │                                                          │
 * │  Title                                                   │
 * │                                                          │
 * │  Body                                                    │
 * │                                                          │
 * │  Next steps                                              │
 * │    • Run `cd santorini-goods`                              │
 * │    • To preview your project, run `npm app dev`            │
 * │    • To add extensions, run `npm generate extension`       │
 * │                                                          │
 * │  Reference                                               │
 * │    • Run `npm shopify help`                                │
 * │    • Press 'return' to open the dev docs:                │
 * │      https://shopify.dev                                 │
 * │                                                          │
 * │  Link: https://shopify.com                               │
 * │                                                          │
 * ╰──────────────────────────────────────────────────────────╯
 * ```
 */
export function renderSuccess(options: RenderAlertOptions) {
  alert({...options, type: 'success'})
}

/**
 * Renders a warning banner to the console.
 *
 * Basic:
 *
 * ```
 * ╭─ warning ────────────────────────────────────────────────╮
 * │                                                          │
 * │  Title                                                   │
 * │                                                          │
 * ╰──────────────────────────────────────────────────────────╯
 * ```
 *
 * Complete:
 * ```
 * ╭─ warning ────────────────────────────────────────────────╮
 * │                                                          │
 * │  Title                                                   │
 * │                                                          │
 * │  Body                                                    │
 * │                                                          │
 * │  Next steps                                              │
 * │    • Run `cd santorini-goods`                            │
 * │    • To preview your project, run `npm app dev`          │
 * │    • To add extensions, run `npm generate extension`     │
 * │                                                          │
 * │  Reference                                               │
 * │    • Run `npm shopify help`                              │
 * │    • Press 'return' to open the dev docs:                │
 * │      https://shopify.dev                                 │
 * │                                                          │
 * │  Link: https://shopify.com                               │
 * │                                                          │
 * ╰──────────────────────────────────────────────────────────╯
 * ```
 */
export function renderWarning(options: RenderAlertOptions) {
  alert({...options, type: 'warning'})
}

function helperProgress(props: ProgressProps[]) {
  const mapped = props.map((prop) => <Progress {...prop} />)
  const {rerender} = render(<>{mapped}</>)

  const timer = setInterval(() => {
    props.forEach((prop) => {
      prop.percent = Math.min(prop.percent + Math.random(), 100)
    })
    const mapped = props.map((prop) => <Progress {...prop} />)
    rerender(<>{mapped}</>)
    if (props.every((prop) => prop.percent >= 100)) {
      clearInterval(timer)
    }
  }, 20)
}

export function renderProgress() {
  const props: ProgressProps = {
    percent: 0,
    barWidth: 40,
    backgroundColor: 'blue',
    barColor: 'white',
    textColor: 'red',
    label: 'GB',
    showPercentage: false,
  }

  const props2: ProgressProps = {
    percent: 0,
    barWidth: 60,
    backgroundColor: 'yellow',
    barColor: 'red',
    textColor: 'purple',
    label: 'Spain:',
  }

  const props3: ProgressProps = {
    percent: 0,
    barWidth: 80,
    backgroundColor: 'white',
    barColor: 'green',
    textColor: 'red',
  }
  helperProgress([props, props2, props3])
}
/**
 * Renders a Fatal error to the console inside a banner.
 *
 * ```
 * ╭─ error ──────────────────────────────────────────────────╮
 * │                                                          │
 * │  Couldn't connect to the Shopify Partner Dashboard.      │
 * │                                                          │
 * │  Check your internet connection and try again.           │
 * │                                                          │
 * ╰──────────────────────────────────────────────────────────╯
 * ```
 */
export function renderFatalError(error: Fatal) {
  fatalError(error)
}

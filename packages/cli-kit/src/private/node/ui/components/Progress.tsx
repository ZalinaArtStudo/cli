import React from 'react'
import {Text} from 'ink'

export interface ProgressProps {
  percent: number
  barWidth: number
  backgroundColor: string
  textColor: string
  barColor: string
  label?: string
  showPercentage?: boolean
}

interface ProgressTextProps {
  content: string
  backgroundColor: string
  textColor: string
}

function ProgressText(props: ProgressTextProps) {
  return (
    <Text bold color={props.textColor} backgroundColor={props.backgroundColor}>
      {props.content}
    </Text>
  )
}

const Progress: React.FC<ProgressProps> = (props) => {
  const showPercentage = !(props.showPercentage === false)
  const percentString = ` ${props.label ?? ''} ${showPercentage ? `${Math.floor(props.percent)}%` : ''}`
  const bar = new Array(props.barWidth).fill(' ').map((_, i) => {
    const percentCharacter = percentString[i] ?? ' '

    if (i < Math.floor((props.percent / 100) * props.barWidth)) {
      return (
        <ProgressText content={percentCharacter} backgroundColor={props.barColor} textColor={props.textColor} key={i} />
      )
    } else {
      return (
        <ProgressText
          content={percentCharacter}
          backgroundColor={props.backgroundColor}
          textColor={props.textColor}
          key={i}
        />
      )
    }
  })
  return <Text>{bar}</Text>
}

export {Progress}

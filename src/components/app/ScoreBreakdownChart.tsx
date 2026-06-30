'use client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

interface ScoreBreakdownChartProps {
  skillScore: number
  evidenceScore: number
  roleScore: number
  preferenceScore: number
  freshnessScore: number
}

export default function ScoreBreakdownChart(props: ScoreBreakdownChartProps) {
  const data = [
    { axis: '기술 스택', value: props.skillScore },
    { axis: '경력 증거', value: props.evidenceScore },
    { axis: '역할 적합', value: props.roleScore },
    { axis: '선호도', value: props.preferenceScore },
    { axis: '최신성', value: props.freshnessScore },
  ]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
        <Radar
          dataKey="value"
          name="점수"
          fill="#7A97D6"
          fillOpacity={0.12}
          stroke="#7A97D6"
          strokeWidth={2}
          dot={{ r: 3, fill: '#D0D6E0' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

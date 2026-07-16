'use client';

import { TextInput } from '@astryxdesign/core/TextInput';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector, type SelectorOptionType } from '@astryxdesign/core/Selector';

interface Props {
  widgetLabel: string;
  titleValue: string;
  onTitleChange: (value: string) => void;
  isChart: boolean;
  chartType?: 'line' | 'bar';
  onChartTypeChange?: (value: 'line' | 'bar') => void;
  dataSourceValue: string;
  dataSourceOptions: SelectorOptionType[];
  onDataSourceChange: (value: string) => void;
}

export default function ManualEditPane({
  widgetLabel,
  titleValue,
  onTitleChange,
  isChart,
  chartType,
  onChartTypeChange,
  dataSourceValue,
  dataSourceOptions,
  onDataSourceChange,
}: Props) {
  return (
    <div className="h-full overflow-y-auto p-5 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Edit widget</h3>
        <p className="text-sm text-slate-400 mt-0.5">{widgetLabel}</p>
      </div>

      <TextInput
        label="Title"
        value={titleValue}
        onChange={onTitleChange}
        placeholder={widgetLabel}
      />

      {isChart && chartType && onChartTypeChange && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Chart type</p>
          <SegmentedControl
            label="Chart type"
            value={chartType}
            onChange={(v) => onChartTypeChange(v as 'line' | 'bar')}
          >
            <SegmentedControlItem value="line" label="Line" />
            <SegmentedControlItem value="bar" label="Bar" />
          </SegmentedControl>
        </div>
      )}

      <Selector
        label="Data source"
        value={dataSourceValue}
        onChange={(v) => onDataSourceChange(v)}
        options={dataSourceOptions}
        hasSearch
      />
    </div>
  );
}

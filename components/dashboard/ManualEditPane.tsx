'use client';

import { TextInput } from '@astryxdesign/core/TextInput';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector, type SelectorOptionType } from '@astryxdesign/core/Selector';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Icon } from '@astryxdesign/core/Icon';

interface Props {
  widgetLabel: string;
  onClose: () => void;
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
  onClose,
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
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">Edit widget</h3>
          <p className="text-xs text-slate-400 truncate">{widgetLabel}</p>
        </div>
        <IconButton icon={<Icon icon="close" size="sm" />} label="Close" variant="ghost" onClick={onClose} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-6">
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
    </div>
  );
}

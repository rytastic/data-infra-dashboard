'use client';

import { useState } from 'react';
import { TextInput } from '@astryxdesign/core/TextInput';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector, type SelectorOptionType } from '@astryxdesign/core/Selector';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Icon } from '@astryxdesign/core/Icon';
import { Button } from '@astryxdesign/core/Button';

export interface ManualEditValues {
  title: string;
  chartType?: 'line' | 'bar';
  dataSourceValue: string;
}

interface Props {
  widgetLabel: string;
  onClose: () => void;
  initialTitle: string;
  isChart: boolean;
  initialChartType?: 'line' | 'bar';
  initialDataSourceValue: string;
  dataSourceOptions: SelectorOptionType[];
  onSave: (values: ManualEditValues) => void;
}

export default function ManualEditPane({
  widgetLabel,
  onClose,
  initialTitle,
  isChart,
  initialChartType,
  initialDataSourceValue,
  dataSourceOptions,
  onSave,
}: Props) {
  // Local draft state — nothing here touches the dashboard until Save is
  // pressed. Remounted (via a `key` on the parent) whenever the target
  // widget changes, so the draft always starts from that widget's values.
  const [title, setTitle] = useState(initialTitle);
  const [chartType, setChartType] = useState(initialChartType);
  const [dataSourceValue, setDataSourceValue] = useState(initialDataSourceValue);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">Edit widget</h3>
          <p className="text-xs text-slate-400 truncate">{widgetLabel}</p>
        </div>
        <IconButton icon={<Icon icon="close" size="sm" />} label="Close" variant="ghost" onClick={onClose} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-6">
        <TextInput
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder={widgetLabel}
        />

        {isChart && chartType && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Chart type</p>
            <SegmentedControl
              label="Chart type"
              value={chartType}
              onChange={(v) => setChartType(v as 'line' | 'bar')}
            >
              <SegmentedControlItem value="line" label="Line" />
              <SegmentedControlItem value="bar" label="Bar" />
            </SegmentedControl>
          </div>
        )}

        <Selector
          label="Data source"
          value={dataSourceValue}
          onChange={setDataSourceValue}
          options={dataSourceOptions}
          hasSearch
        />
      </div>

      <div className="flex-shrink-0 flex items-center justify-end px-5 py-3 border-t border-slate-100">
        <Button
          label="Save"
          variant="primary"
          onClick={() => onSave({ title, chartType, dataSourceValue })}
        />
      </div>
    </div>
  );
}

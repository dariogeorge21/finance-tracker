'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';

// Type assertion for ResponsiveContainer to fix compatibility issues
const TypedResponsiveContainer = ResponsiveContainer as React.FC<{
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
}>;

// Utility function for combining class names (compatible with Mantine)
function cn(...classes: Parameters<typeof clsx>): string {
  return clsx(classes);
}

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart(): ChartContextProps {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

// Error Boundary Component
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Chart Error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p>Unable to render chart</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ReactNode;
    errorFallback?: React.ReactNode;
  }
>(({ id, className, children, config, errorFallback, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = React.useMemo(
    () => `chart-${(id ?? uniqueId).replace(/:/g, '')}`,
    [id, uniqueId]
  );

  // Validate config
  const validatedConfig = React.useMemo(() => {
    if (!config || typeof config !== 'object') {
      console.warn('Invalid chart config provided, using empty config');
      return {};
    }
    return config;
  }, [config]);

  return (
    <ChartErrorBoundary fallback={errorFallback}>
      <ChartContext.Provider value={{ config: validatedConfig }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            // Base styles - using Tailwind classes that work well with Mantine
            "flex aspect-video justify-center text-xs relative",
            // Recharts styling with improved specificity and Mantine compatibility
            "[&_.recharts-cartesian-axis-tick_text]:fill-gray-600 dark:[&_.recharts-cartesian-axis-tick_text]:fill-gray-400",
            "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-gray-200 dark:[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-gray-700",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-gray-300 dark:[&_.recharts-curve.recharts-tooltip-cursor]:stroke-gray-600",
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-layer]:outline-none",
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-gray-200 dark:[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-gray-700",
            "[&_.recharts-radial-bar-background-sector]:fill-gray-100 dark:[&_.recharts-radial-bar-background-sector]:fill-gray-800",
            "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-gray-100 dark:[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-gray-800",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-gray-200 dark:[&_.recharts-reference-line_[stroke='#ccc']]:stroke-gray-700",
            "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-sector]:outline-none",
            "[&_.recharts-surface]:outline-none",
            className
          )}
          role="img"
          aria-label="Chart visualization"
          {...props}
        >
          <ChartStyle id={chartId} config={validatedConfig} />
          <TypedResponsiveContainer width="100%" height="100%">
            {children}
          </TypedResponsiveContainer>
        </div>
      </ChartContext.Provider>
    </ChartErrorBoundary>
  );
});
ChartContainer.displayName = 'ChartContainer';

type ChartStyleProps = {
  id: string;
  config: ChartConfig;
};

const ChartStyle: React.FC<ChartStyleProps> = React.memo(({ id, config }) => {
  const colorConfig = React.useMemo(() => {
    return Object.entries(config).filter(
      ([, cfg]) => cfg && (cfg.color !== undefined || cfg.theme !== undefined)
    );
  }, [config]);

  const css = React.useMemo(() => {
    if (colorConfig.length === 0) {
      return '';
    }

    return Object.entries(THEMES)
      .map(([themeName, selectorPrefix]) => {
        const rules = colorConfig
          .map(([key, cfg]) => {
            if (!cfg) return null;
            
            // Type-safe theme access
            const color = cfg.theme?.[themeName as keyof typeof THEMES] ?? cfg.color;
            
            if (color && typeof color === 'string') {
              return `  --color-${key}: ${color};`;
            }
            return null;
          })
          .filter(Boolean)
          .join('\n');

        if (!rules) {
          return '';
        }

        return `
${selectorPrefix} [data-chart="${id}"] {
${rules}
}`;
      })
      .filter(Boolean)
      .join('\n');
  }, [colorConfig, id]);

  if (!css) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
});
ChartStyle.displayName = 'ChartStyle';

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipContentProps = {
  active?: boolean;
  payload?: any[];
  className?: string;
  indicator?: 'line' | 'dot' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: any;
  labelFormatter?: (label: any, payload?: any) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: any,
    name: any,
    item: any,
    index: number,
    payload: any
  ) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
};

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    // Early return with proper validation
    if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel) {
        return null;
      }

      try {
        const first = payload[0];
        if (!first) return null;

        const key = `${labelKey ?? first.dataKey ?? first.name ?? 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, first, key);

        let valueLabel: React.ReactNode = undefined;
        if (!labelKey && typeof label === 'string') {
          valueLabel = config[label]?.label ?? label;
        } else {
          valueLabel = itemConfig?.label;
        }

        if (labelFormatter && typeof labelFormatter === 'function') {
          return (
            <div className={cn('font-medium text-gray-900 dark:text-gray-100', labelClassName)}>
              {labelFormatter(valueLabel, payload)}
            </div>
          );
        }

        if (valueLabel === undefined || valueLabel === null) {
          return null;
        }

        return (
          <div className={cn('font-medium text-gray-900 dark:text-gray-100', labelClassName)}>
            {valueLabel}
          </div>
        );
      } catch (error) {
        console.error('Error rendering tooltip label:', error);
        return null;
      }
    }, [hideLabel, labelFormatter, payload, label, labelKey, config, labelClassName]);

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs shadow-xl z-50',
          className
        )}
        role="tooltip"
      >
        {!nestLabel && tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((item, idx) => {
            try {
              const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`;
              const itemConfig = getPayloadConfigFromPayload(config, item, key);
              const indicatorColor = color ?? item.payload?.fill ?? item.color ?? '#8884d8';

              return (
                <div
                  key={`${item.dataKey ?? key}-${idx}`}
                  className={cn(
                    'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-gray-500',
                    indicator === 'dot' && 'items-center'
                  )}
                >
                  {formatter && typeof formatter === 'function' && item.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, idx, item.payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <div
                            className={cn(
                              'shrink-0 rounded-[2px] border',
                              {
                                'h-2.5 w-2.5': indicator === 'dot',
                                'w-1 h-4': indicator === 'line',
                                'w-0 h-4 border-[1.5px] border-dashed bg-transparent':
                                  indicator === 'dashed',
                                'my-0.5': nestLabel && indicator === 'dashed',
                              }
                            )}
                            style={{
                              backgroundColor: indicator !== 'dashed' ? indicatorColor : 'transparent',
                              borderColor: indicatorColor,
                            } as React.CSSProperties}
                            aria-hidden="true"
                          />
                        )
                      )}
                      <div
                        className={cn(
                          'flex flex-1 justify-between leading-none',
                          nestLabel ? 'items-end' : 'items-center'
                        )}
                      >
                        <div className="grid gap-1.5">
                          {nestLabel && tooltipLabel}
                          <span className="text-gray-600 dark:text-gray-400">
                            {itemConfig?.label ?? item.name}
                          </span>
                        </div>
                        {item.value !== null && item.value !== undefined && (
                          <span className="font-mono font-medium tabular-nums text-gray-900 dark:text-gray-100">
                            {typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value)}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            } catch (error) {
              console.error('Error rendering tooltip item:', error);
              return null;
            }
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartYAxis = RechartsPrimitive.YAxis;

const ChartLegend = RechartsPrimitive.Legend;

// Define necessary types that aren't properly exported from Recharts
type LegendType = 
  | 'plainline' 
  | 'line' 
  | 'square' 
  | 'rect'
  | 'circle' 
  | 'cross'
  | 'diamond'
  | 'star'
  | 'triangle'
  | 'wye'
  | 'none';

// Define LegendPayload interface since it's not exported from Recharts
interface LegendPayload {
  value: any;
  id?: string;
  type?: LegendType;
  color?: string;
  payload?: any;
  dataKey?: string | number;
  name?: string;
  inactive?: boolean;
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    payload?: Array<LegendPayload>;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    onMouseEnter?: RechartsPrimitive.LegendProps['onMouseEnter'];
    onMouseLeave?: RechartsPrimitive.LegendProps['onMouseLeave'];
    onClick?: RechartsPrimitive.LegendProps['onClick'];
    hideIcon?: boolean;
    nameKey?: string;
  }
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = 'bottom',
      nameKey,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ...rest
    },
    ref
  ) => {
    const { config } = useChart();

    if (!payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-4 flex-wrap',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className
        )}
        role="list"
        aria-label="Chart legend"
        {...rest}
      >
        {payload.map((item, idx) => {
          try {
            const key = `${nameKey || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            
            return (
              <div
                key={`${item.dataKey ?? key}-${idx}`}
                className={cn(
                  'flex items-center gap-1.5 cursor-pointer [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-gray-500',
                  'hover:opacity-80 transition-opacity'
                )}
                role="listitem"
                onMouseEnter={(e) => onMouseEnter?.(item, idx, e)}
                onMouseLeave={(e) => onMouseLeave?.(item, idx, e)}
                onClick={(e) => onClick?.(item, idx, e)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.(item, idx, e as any);
                  }
                }}
              >
                {itemConfig?.icon && !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: item.color || '#8884d8',
                    }}
                    aria-hidden="true"
                  />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {itemConfig?.label ?? item.value}
                </span>
              </div>
            );
          } catch (error) {
            console.error('Error rendering legend item:', error);
            return null;
          }
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegendContent';

// Helper function to get payload configuration with better error handling
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any,
  key: string
): ChartConfig[string] | null {
  if (!config || !payload || typeof config !== 'object') {
    return null;
  }
  
  try {
    const configLabelKey = payload?.name && key !== payload.name ? payload.name : key;
    
    return configLabelKey in config
      ? config[configLabelKey]
      : config[key] || null;
  } catch (error) {
    console.error('Error getting payload config:', error);
    return null;
  }
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartYAxis,
};
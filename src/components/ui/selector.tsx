import { type ReactNode, useEffect, useRef } from "react";

export interface SelectorOption<T extends string | JSX.Element> {
  title: T;
  onClick?: () => void;
}

interface Props<T extends string | JSX.Element> {
  name: string;
  head: ReactNode;
  options: SelectorOption<T>[];
  showOptions: boolean;
  className?: string;
  onSelect?: (result: { name: string; value: T }) => void;
  onClose?: () => void;
}

// selector doesn't need a value, because, value will be shown in head, and head will be in the parent component
export function Selector<T extends string | JSX.Element>({
  head,
  options,
  showOptions,
  className,
  onSelect,
  onClose,
  name,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = `${name}selector`;

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if ((e.target as HTMLDivElement).closest("#" + id)) {
        return;
      }
      showOptions && onClose && onClose();
    };

    document.body.addEventListener("click", cb);

    return () => {
      document.body.removeEventListener("click", cb);
    };
  }, [onClose, showOptions, id]);

  return (
    <div id={id} ref={containerRef} className={`relative ${className}`}>
      {head}

      {showOptions && (
        <div className="absolute right-0 top-12 z-10 w-full space-y-2 rounded border-2 border-gray-200 bg-white p-2 text-gray-900">
          {options.map(({ title, onClick }) => (
            <div
              onClick={() => {
                onSelect && onSelect({ name, value: title });
                if (onSelect) onClose && onClose();
                onClick && onClick();
              }}
              className="flex w-full cursor-pointer items-center justify-start rounded bg-gray-100 px-2 py-1 transition hover:bg-gray-900 hover:text-white active:bg-gray-600"
              key={
                (typeof title === "string"
                  ? title
                  : // title can be string of JSX.Element
                    Object.keys(title).toString()) + onClick?.toString()
              }
            >
              {title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

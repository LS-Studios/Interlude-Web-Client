import { useCallback, useRef, useState } from 'react';

export const useLongPress = (
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 300 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // Prevent long press on right-click
      if (event.nativeEvent instanceof MouseEvent && event.nativeEvent.button !== 0) {
        return;
      }

      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, { passive: false });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      
      // Check if the click should be triggered.
      // It should only be triggered if there was no long press and the click is enabled.
      if (shouldTriggerClick && !longPressTriggered) {
          // Check if the click target is the share button or its icon, if so, don't trigger the main onClick
          const clickTarget = event.target as HTMLElement;
          if (!clickTarget.closest('button[aria-label="Share link"]')) {
              onClick();
          }
      }
      
      setLongPressTriggered(false);
      
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  );

  const preventDefault = (event: Event) => {
    if (!longPressTriggered){
      return;
    }
    if (event.cancelable) {
        event.preventDefault();
    }
  };

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
  };
};

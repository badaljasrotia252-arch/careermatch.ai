import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useScrollReveal — IntersectionObserver-based scroll reveal hook.
 * Returns a ref to attach to the element and whether it's visible.
 */
export function useScrollReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // Only animate once
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}

/**
 * useAnimatedCounter — Smoothly counts up from 0 to target.
 */
export function useAnimatedCounter(target, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollReveal();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnVisible || !isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const numTarget = typeof target === 'string' ? parseInt(target) : target;
    if (isNaN(numTarget)) {
      setCount(target);
      return;
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numTarget));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration, startOnVisible]);

  return [ref, count];
}

/**
 * useTypingEffect — Types out text character by character.
 */
export function useTypingEffect(texts, typingSpeed = 60, deletingSpeed = 30, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isPaused = useRef(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const tick = () => {
      const currentText = texts[textIndex.current];

      if (isPaused.current) {
        isPaused.current = false;
        setIsTyping(false);
        return setTimeout(tick, pauseDuration);
      }

      if (isTyping) {
        if (charIndex.current < currentText.length) {
          charIndex.current++;
          setDisplayText(currentText.slice(0, charIndex.current));
          return setTimeout(tick, typingSpeed);
        } else {
          isPaused.current = true;
          return setTimeout(tick, 100);
        }
      } else {
        if (charIndex.current > 0) {
          charIndex.current--;
          setDisplayText(currentText.slice(0, charIndex.current));
          return setTimeout(tick, deletingSpeed);
        } else {
          textIndex.current = (textIndex.current + 1) % texts.length;
          setIsTyping(true);
          return setTimeout(tick, 300);
        }
      }
    };

    const timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [texts, isTyping, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

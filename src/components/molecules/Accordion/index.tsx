import { useState, useEffect, useRef } from 'react';
import './Accordion.scss';

type AccordionProps = {
	summary: string;
	children?: React.ReactNode;
};

export function Accordion({ summary, children }: AccordionProps) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const handler = () => setOpen(true);
		el.addEventListener('hdg-details-open', handler);
		return () => el.removeEventListener('hdg-details-open', handler);
	}, []);

	return (
		<div ref={containerRef} className={`hdg-details${open ? ' hdg-details--open' : ''}`}>
			<button
				type="button"
				className="hdg-details-summary"
				onClick={() => setOpen(v => !v)}
				aria-expanded={open}
			>
				{summary}
			</button>
			<div className="hdg-details-content">{children}</div>
		</div>
	);
}

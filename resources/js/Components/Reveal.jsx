import { motion, useReducedMotion } from 'framer-motion';

const defaults = { opacity: 0, y: 24 };

export function Reveal({
    children,
    className,
    delay = 0,
    duration = 0.5,
    y = defaults.y,
    once = true,
    as = 'div',
    ...rest
}) {
    const reduce = useReducedMotion();
    const Component = motion[as] || motion.div;

    if (reduce) {
        return <Component className={className} {...rest}>{children}</Component>;
    }

    return (
        <Component
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: '-40px' }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
            {...rest}
        >
            {children}
        </Component>
    );
}

export function StaggerContainer({
    children,
    className,
    stagger = 0.08,
    once = true,
    ...rest
}) {
    const reduce = useReducedMotion();

    if (reduce) {
        return <motion.div className={className} {...rest}>{children}</motion.div>;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: '-40px' }}
            variants={{ visible: { transition: { staggerChildren: stagger } } }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
}

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

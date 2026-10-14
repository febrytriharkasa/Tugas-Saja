import { Link } from '@inertiajs/react';
import Icon from '@/Components/Icon';

export default function Button({ 
    variant = 'primary', 
    size = 'md', 
    href, 
    type = 'button',
    icon,
    children, 
    className = '',
    ...props 
}) {
    const baseClasses = 'inline-flex min-h-11 items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    
    const variants = {
        primary: 'bg-primary hover:bg-primary-light text-white focus:ring-primary',
        secondary: 'bg-secondary hover:bg-secondary-light text-white focus:ring-secondary',
        tertiary: 'bg-tertiary hover:bg-tertiary-light text-white focus:ring-tertiary',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-primary hover:underline',
    };
    
    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-5 py-2.5 text-base rounded-lg',
        lg: 'px-6 py-3 text-lg rounded-xl',
    };
    
    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
    
    const content = (
        <>
            {icon && <Icon name={icon} />}
            {children}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {content}
            </Link>
        );
    }
    
    return (
        <button type={type} className={classes} {...props}>
            {content}
        </button>
    );
}

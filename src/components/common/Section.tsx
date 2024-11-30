'use client';

import { Component, ReactNode, HTMLAttributes } from 'react';

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode; // Content inside the section
};

export default class Section extends Component<SectionProps> {
  render() {
    const { children, className, ...rest } = this.props; // Spread other props

    return (
      <section
        className={`flex flex-col content-center items-center px-4 py-16 text-foreground ${
          className || ''
        }`.trim()} // Combine default and additional class names
        {...rest} // Spread remaining attributes (e.g., id, onClick)
      >
        {children}
      </section>
    );
  }
}

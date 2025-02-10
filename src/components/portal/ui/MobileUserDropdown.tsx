import React from 'react';
import Link from 'next/link';
import { User } from '@/common/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bolt, MessageCircle, Pin, UserPen, LogOut } from 'lucide-react';

interface MobileUserDropdownProps {
  user: User;
  onLogout: () => void;
  onOpenChat: any;
}

export default function MobileUserDropdown({
                                             user,
                                             onLogout,
                                             onOpenChat,
                                           }: MobileUserDropdownProps) {
  return (
    <div className="flex flex-col space-y-2">
      {/* User info (name + email + avatar) */}
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${user?.image}`}
            alt="Profile image"
          />
          <AvatarFallback>
            {/* Fall back to first letters if image is missing */}
            {user.name
              .split(' ')
              .map(part => part[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </div>
      </div>

      <hr className="my-2 border-secondary" />

      {/* Menu Items */}
      <button
        type="button"
        className="flex items-center space-x-2"
        onClick={() => {
          // TODO: handle your "Innstillinger" flow
        }}
      >
        <Bolt size={16} strokeWidth={2} className="opacity-60" />
        <span>Innstillinger</span>
      </button>

      <button
        type="button"
        className="flex items-center space-x-2"
        onClick={onOpenChat}
      >
        <MessageCircle size={16} strokeWidth={2} className="opacity-60" />
        <span>Meldinger</span>
      </button>

      {user.role === 'arbeidstaker' && (
        <Link href="/portal/mine-soknader" className="flex items-center space-x-2">
          <Pin size={16} strokeWidth={2} className="opacity-60" />
          <span>Mine søknader</span>
        </Link>
      )}
      {user.role === 'arbeidsgiver' && (
        <Link href="/portal" className="flex items-center space-x-2">
          <Pin size={16} strokeWidth={2} className="opacity-60" />
          <span>Mine Jobber</span>
        </Link>
      )}

      <Link href="/portal/profil" className="flex items-center space-x-2">
        <UserPen size={16} strokeWidth={2} className="opacity-60" />
        <span>Profil</span>
      </Link>

      <button
        type="button"
        className="flex items-center space-x-2"
        onClick={onLogout}
      >
        <LogOut size={16} strokeWidth={2} className="opacity-60" />
        <span>Logout</span>
      </button>
    </div>
  );
}

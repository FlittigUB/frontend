import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Bolt,
  ChevronDown,
  LogOut,
  MessageCircle,
  Pin,
  UserPen,
} from 'lucide-react';
import { User } from '@/common/types';
import Link from 'next/link';

interface UserDropdownProps {
  user: User;
  onLogout: any;
  onOpenChat: any;
}

export default function UserDropdown({
  user,
  onLogout,
  onOpenChat,
}: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${user.image}`}
              alt="Profile image"
            />
            <AvatarFallback>{user.name.split(" ").map(part => part[0].toUpperCase()).join("")}</AvatarFallback>
          </Avatar>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="ms-2 opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Bolt
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Innstillinger</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircle
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <button onClick={onOpenChat}>Meldinger</button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === 'arbeidstaker' && (
            <DropdownMenuItem>
              <Pin
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <Link href={`/portal/mine-soknader`}>Mine søknader</Link>
            </DropdownMenuItem>
          )}
          {user.role === 'arbeidsgiver' && (
            <DropdownMenuItem>
              <Pin
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <Link href={`/portal`}>Mine stillinger</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <UserPen
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <Link href={'/portal/profil'}>Profil</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
          <button onClick={onLogout}>Logout</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

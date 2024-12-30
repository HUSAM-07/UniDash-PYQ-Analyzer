import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const MobileMenu: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => {/* Handle Select */}}>
          Option 1
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {/* Handle Select */}}>
          Option 2
        </DropdownMenuItem>
        {/* Add more DropdownMenuItems as needed */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileMenu; 
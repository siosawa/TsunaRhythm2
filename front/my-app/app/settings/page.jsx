"use client"
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
const Setting = () => {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
    <DropdownMenu>
  <DropdownMenuTrigger>設定</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSeparator />
    <DropdownMenuItem>マイページ</DropdownMenuItem>
    <DropdownMenuItem>プロフィール編集</DropdownMenuItem>
    <DropdownMenuItem>ログアウト</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    </>
  );
}

export default Setting;

'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { BellIcon, ChatBubbleLeftRightIcon, Squares2X2Icon, CreditCardIcon, ClipboardIcon, BookmarkIcon, StarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { TruckIcon, IdentificationIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

// Updated vehicle categories with SVG icons
const categories = [
  { name: 'Ô tô', href: '/vehicles/type/car', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )},
  { name: 'Xe máy', href: '/vehicles/type/motorcycle', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M4 16v1a2 2 0 002 2h.5a2.5 2.5 0 100-5H4v2zm0 0h8m-8-5h2l3-5l1.25 2.5M19 16v1a2 2 0 01-2 2h-.5a2.5 2.5 0 110-5H19v2zm0 0h-8m9-5h-2l-3-5L13.75 8.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6.5" cy="16.5" r="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17.5" cy="16.5" r="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { name: 'Xe đạp', href: '/vehicles/type/bicycle', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="5.5" cy="17.5" r="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18.5" cy="17.5" r="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 6a1 1 0 100-2 1 1 0 000 2zm-3 11.5l-5-4.5m5 4.5V9l7 6m0-6h-7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
]

// Keeping this for mobile navigation
const navigation = [
  { name: 'Cars', href: '/vehicles/type/car' },
  { name: 'Motorcycles', href: '/vehicles/type/motorcycle' },
  { name: 'Bicycles', href: '/vehicles/type/bicycle' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('activity')

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/" className="text-white font-bold text-xl">
                    Used Vehicles
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {/* Replacing individual navigation links with Categories dropdown */}
                    <Menu as="div" className="relative">
                      <Menu.Button className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center">
                        <Bars3Icon className="h-5 w-5 mr-1" aria-hidden="true" />
                        Danh Mục
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {categories.map((category) => (
                            <Menu.Item key={category.name}>
                              {({ active }) => (
                                <Link
                                  href={category.href}
                                  className={`${
                                    active ? 'bg-gray-100' : ''
                                  } flex items-center px-4 py-3 text-sm text-gray-700`}
                                >
                                  <span className="mr-3 text-gray-600">{category.icon}</span>
                                  {category.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {isAuthenticated ? (
                    <>
                      {/* Notification dropdown */}
                      <Menu as="div" className="relative mr-3">
                        {({ open }) => (
                          <>
                            <div>
                              <Menu.Button className="p-1 text-gray-400 hover:text-white focus:outline-none active:scale-95 active:opacity-80 transition-all duration-150">
                                <span className="sr-only">Thông báo</span>
                                <BellIcon className={`h-6 w-6 ${open ? 'text-white' : ''}`} aria-hidden="true" />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="border-b flex">
                                  <button 
                                    onClick={() => setActiveTab('activity')}
                                    className={`px-4 py-3 text-sm font-medium flex-1 text-center transition duration-150 ${
                                      activeTab === 'activity' 
                                        ? 'border-b-2 border-orange-500 text-gray-900' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    HOẠT ĐỘNG
                                  </button>
                                  <button 
                                    onClick={() => setActiveTab('news')}
                                    className={`px-4 py-3 text-sm font-medium flex-1 text-center transition duration-150 ${
                                      activeTab === 'news' 
                                        ? 'border-b-2 border-orange-500 text-gray-900' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    TIN MỚI
                                  </button>
                                </div>
                                {activeTab === 'activity' ? (
                                  <div className="p-4 text-center text-sm text-gray-500">
                                    Bạn chưa có hoạt động nào.
                                  </div>
                                ) : (
                                  <div className="p-4 text-center text-sm text-gray-500">
                                    Không có tin mới nào.
                                  </div>
                                )}
                              </Menu.Items>
                            </Transition>
                          </>
                        )}
                      </Menu>

                      <Link
                        href="/chat"
                        className="p-1 text-gray-400 hover:text-white focus:outline-none mr-3 active:scale-95 active:opacity-80 transition-all duration-150"
                      >
                        <span className="sr-only">Tin nhắn</span>
                        <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
                      </Link>

                      <Link
                        href="/my-vehicles"
                        className="flex items-center rounded-md bg-gray-800 px-3 py-1 text-gray-400 hover:text-white focus:outline-none mr-3"
                      >
                        <Squares2X2Icon className="h-5 w-5 mr-1" aria-hidden="true" />
                        <span className="text-sm">Quản lý tin</span>
                      </Link>

                      <Link
                        href="/vehicles/create"
                        className="flex items-center rounded-md bg-orange-500 px-3 py-1.5 text-white hover:bg-orange-600 focus:outline-none mr-3 transition-colors"
                      >
                        <span className="text-sm font-medium">ĐĂNG TIN</span>
                      </Link>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex items-center px-3 py-1.5 text-sm font-medium text-white hover:opacity-75 focus:outline-none">
                            <img
                              className="h-6 w-6 rounded-full mr-2"
                              src={user?.avatar_url || "/user-avatar.png"}
                              alt="Avatar"
                            />
                            <span>{user?.full_name || "Tài khoản"}</span>
                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {/* User info section */}
                            <div className="px-4 py-3">
                              <Link href="/profile" className="block hover:bg-gray-50 -mx-4 -my-3 px-4 py-3 rounded-t-md transition duration-150">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={user?.avatar_url || "/user-avatar.png"}
                                      alt="Avatar"
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user?.full_name || "Tài khoản"}</div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500">0.0</span>
                                      <div className="flex ml-1">
                                        {[...Array(5)].map((_, i) => (
                                          <svg key={i} className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                      <span className="ml-1 text-xs text-gray-500">Chưa có đánh giá</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 flex text-sm text-gray-500 justify-between">
                                  <div>
                                    <span className="font-medium text-gray-900">0</span> Người theo dõi
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">0</span> Đang theo dõi
                                  </div>
                                </div>
                              </Link>
                            </div>

                            {/* Divider */}
                            <hr className="my-1" />

                            {/* Account ID section */}
                            <div className="px-4 py-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                  </svg>
                                  TK Định danh: C0888270...
                                </div>
                                <button className="text-xs text-blue-600">Sao chép</button>
                              </div>
                            </div>

                            {/* Order Management */}
                            <div className="px-4 py-2">
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quản lí đơn hàng</div>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/orders/purchases"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                                    </svg>
                                    Đơn mua
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/orders/sales"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                    </svg>
                                    Đơn bán
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>

                            {/* Utilities */}
                            <div className="px-4 py-2">
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tiện ích</div>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/saved-listings"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                    </svg>
                                    Tin đăng đã lưu
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/saved-searches"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                                    </svg>
                                    Tìm kiếm đã lưu
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/my-reviews"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Đánh giá từ tôi
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>

                            {/* Other options section */}
                            <div className="px-4 py-2">
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Khác</div>
                              
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/profile/edit"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Cài đặt tài khoản
                                  </Link>
                                )}
                              </Menu.Item>
                              
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/help"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Trợ giúp
                                  </Link>
                                )}
                              </Menu.Item>
                              
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="/feedback"
                                    className={`${active ? 'bg-gray-100' : ''} flex items-center px-2 py-2 text-sm text-gray-700 rounded-md`}
                                  >
                                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    Đóng góp ý kiến
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>

                            {/* Divider */}
                            <hr className="my-1" />

                            {/* Logout */}
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={logout}
                                  className={`${active ? 'bg-gray-100' : ''} flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                  </svg>
                                  Đăng xuất
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/vehicles/create"
                        className="flex items-center rounded-md bg-orange-500 px-3 py-1.5 text-white hover:bg-orange-600 focus:outline-none mr-3 transition-colors"
                      >
                        <span className="text-sm font-medium">ĐĂNG TIN</span>
                      </Link>
                      <Link
                        href="/auth/login"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/auth/register"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block rounded-md px-3 py-2 text-base font-medium`}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {user?.full_name || "Tài khoản"}
                  </Link>
                  <Link
                    href="/vehicles/create"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
                  >
                    ĐĂNG TIN
                  </Link>
                  <button
                    onClick={logout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white w-full text-left"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/vehicles/create"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
                  >
                    ĐĂNG TIN
                  </Link>
                  <Link
                    href="/auth/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
} 
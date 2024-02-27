import { Link, Outlet } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  ChevronDownIcon,
  CodeBracketSquareIcon,
  HomeIcon,
  InboxIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";
import {
  bookingRequestsRoute,
  bookingsRoute,
  profileRoute,
  roomsRoute,
  widgetRoute,
} from "./dashboard.routes";
import { useProfile } from "../hooks";
import { useSignOut } from "@/src/auth/hooks/use_sign_out";

function useNavigation() {
  return [
    {
      name: "Bookings",
      to: bookingsRoute.to,
      icon: CalendarIcon,
    },
    {
      name: "Requests",
      to: bookingRequestsRoute.to,
      icon: InboxIcon,
    },
    {
      name: "Facility & Rooms",
      to: roomsRoute.to,
      icon: HomeIcon,
    },
    {
      name: "Widgets",
      to: widgetRoute.to,
      icon: CodeBracketSquareIcon,
    },
  ] as const;
}

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <div>
      <HeaderBar openSidebar={() => setSidebarOpen(true)} />
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                      alt="Book That Space"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                to={item.to}
                                activeProps={{
                                  className: cn(
                                    "bg-gray-50 text-indigo-600",
                                  ),
                                }}
                                inactiveProps={{
                                  className: cn(
                                    "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                  ),
                                }}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {({ isActive }) => (
                                  <>
                                    <item.icon
                                      className={cn(
                                        isActive
                                          ? "text-indigo-600"
                                          : "text-gray-400 group-hover:text-indigo-600",
                                        "h-6 w-6 shrink-0",
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <DesktopSidebar />
      </div>

      <main className="py-4 lg:py-8 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function HeaderBar(props: { openSidebar: () => void }) {
  const profile = useProfile();
  const signOut = useSignOut();
  const navigationOptions = [
    { name: "My profile", to: profileRoute.to, icon: undefined },
  ] as const;

  return (
    <div className="lg:pl-72">
      <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={props.openSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* Separator */}
        <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1">{/* placeholder */}</div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Separator */}
            <div
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            />
            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <ProfileImgPlaceholder />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                    aria-hidden="true"
                  >
                    {profile.data?.name}
                  </span>
                  <ChevronDownIcon
                    className="ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
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
                <Menu.Items className="absolute right-0 mt-3 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none divide-y divide-gray-100">
                  <div>
                    {navigationOptions.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            className={cn(
                              active ? "bg-gray-50" : "",
                              "block px-5 py-3 text-sm leading-6 text-gray-900",
                            )}
                            to={item.to}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          active ? "bg-gray-50" : "",
                          "block px-5 py-3 text-sm leading-6 text-gray-900 w-full text-left",
                        )}
                        onClick={() => signOut.mutateAsync()}
                      >
                        <span>Sign out</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar() {
  const navigation = useNavigation();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Book That Space"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    to={item.to}
                    activeProps={{
                      className: cn("bg-gray-50 text-indigo-600"),
                    }}
                    inactiveProps={{
                      className: cn(
                        "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                      ),
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-6 shrink-0",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="-mx-6 mt-auto py-4">
            <div className="flex justify-center gap-x-2 px-6 py-2 text-sm leading-6 text-gray-800">
              <InformationCircleIcon
                className="w-6 h-6 text-blue-600"
                aria-hidden="true"
              />
              <span className="truncate" aria-hidden="true">
                Need some help?
              </span>
            </div>

            <div
              className="text-gray-500 italic text-xs text-center"
              data-version={VITE_APP_VERSION}
            >
              Version {VITE_APP_VERSION}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function ProfileImgPlaceholder() {
  return (
    <span className="border-2 border-gray-300 inline-block min-h-8 w-8 overflow-hidden rounded-full bg-gray-100">
      <svg
        className="h-full w-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  );
}

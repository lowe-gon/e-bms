import BgBanner from '@/assets/images/banner.jpg';
import LoginForm from '@/features/sign-in/components/login-form';
import { GalleryVerticalEnd } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'e-BMS | Login',
  description:
    'Log in to e-BMS to manage your barangay efficiently. Access your dashboard, manage residents/households, and stay organized.',
  keywords: ['e-BMS', 'Login'],
};

export default function SignInPage() {
  return (
    <div className="gridre grid h-full lg:grid-cols-2">
      {/* Login Form */}
      <div className="order-2 flex flex-col gap-4 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center gap-2">
          <Link href="#" className="flex items-center gap-2 font-black">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            e-BMS
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="bg-muted relative order-1 hidden lg:block">
        {/* Overlay */}
        <div className="absolute inset-0 z-50 backdrop-blur-xs backdrop-grayscale" />
        <Image src={BgBanner} alt="LoginImage" className="object-right" fill />
      </div>
    </div>
  );
}

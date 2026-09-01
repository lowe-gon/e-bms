import BgBanner from '@/assets/images/LoginBanner.jpg';
import SignInForm from '@/features/sign-in/components/sign-in-form';
import { GalleryVerticalEnd } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:order-2 lg:border-l">
        <div className="flex w-full lg:items-center lg:justify-center">
          <Link href="/" className="flex items-center gap-2 font-black">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            e-BMS
          </Link>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center md:mx-auto md:max-w-xs">
          <SignInForm />
        </div>
      </div>
      <div className="relative hidden lg:order-1 lg:block">
        <Image
          src={BgBanner}
          alt="LoginImage"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-right"
          fill
        />
      </div>
    </div>
  );
}

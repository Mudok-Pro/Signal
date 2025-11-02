'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/components/app-provider';
import { useAuth } from '@/firebase';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const { language } = useApp();
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthAction = () => {
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 font-bold text-lg text-primary mb-4">
              <Image src="https://i.imgur.com/zZbq9tq.png" alt="Mechasos Logo" width={48} height={48} className="h-12 w-12" />
              <div className="flex flex-col">
                <span className="font-headline text-2xl leading-none" lang="en">Mechasos</span>
              </div>
            </div>
          <CardTitle className="text-2xl">
            {isSignUp
              ? language === 'ar'
                ? 'إنشاء حساب'
                : 'Create Account'
              : language === 'ar'
              ? 'تسجيل الدخول'
              : 'Sign In'}
          </CardTitle>
          <CardDescription>
            {language === 'ar'
              ? 'أدخل بياناتك للوصول إلى حسابك'
              : 'Enter your details to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {language === 'ar' ? 'كلمة المرور' : 'Password'}
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleAuthAction}>
            {isSignUp
              ? language === 'ar'
                ? 'إنشاء حساب'
                : 'Sign Up'
              : language === 'ar'
                ? 'تسجيل الدخول'
                : 'Sign In'}
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? language === 'ar'
                ? 'لديك حساب بالفعل؟ تسجيل الدخول'
                : 'Already have an account? Sign In'
              : language === 'ar'
              ? 'ليس لديك حساب؟ إنشاء حساب'
              : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

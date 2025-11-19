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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function LoginPage() {
  const { language } = useApp();
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'client' | 'mechanic'>('client');

  const handleAuthAction = () => {
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password, role);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-3 font-bold text-lg text-primary mb-4">
              <div className="relative w-16 h-16">
                <Image src="/web-app-manifest-192x192.png" alt="Signal Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-2xl leading-none" lang="en">Signal</span>
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
          {isSignUp && (
            <div className="space-y-2">
                <Label>{language === 'ar' ? 'أرغب في التسجيل كـ' : 'I want to register as a'}</Label>
                <RadioGroup defaultValue="client" className="flex gap-4 pt-2" onValueChange={(value: 'client' | 'mechanic') => setRole(value)}>
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="client" id="role-client" />
                        <Label htmlFor="role-client">{language === 'ar' ? 'عميل' : 'Client'}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="mechanic" id="role-mechanic" />
                        <Label htmlFor="role-mechanic">{language === 'ar' ? 'ميكانيكي' : 'Mechanic'}</Label>
                    </div>
                </RadioGroup>
            </div>
          )}
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

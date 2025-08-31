import { useRouter } from 'expo-router';
import RegisterScreen from '@/screens/RegisterScreen';

export default function Register() {
  const router = useRouter();
  return (
    <RegisterScreen
      onRegisterSuccess={() => router.replace('/(tabs)')}
      onShowLogin={() => router.push('/login')}
    />
  );
}


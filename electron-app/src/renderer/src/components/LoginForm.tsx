import { CSSProperties, ReactNode, useState } from "react";
import { useAuthStore } from '@store/authStore';
import { useRouter } from "@tanstack/react-router";
import {motion} from 'framer-motion';
import { Button,TextInput,Text,Card,useToaster } from "@gravity-ui/uikit";
import { authService } from "@services/authService";
// import {Lock} from '@gravity-ui/icons';

export const LoginForm = () =>{
  
  const [credentials,setCredentials] = useState({
    username:'',
    password:''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {add} = useToaster();
  const login = useAuthStore((state)=>state.login);
  const router = useRouter();

  const handleSubmit = async (e:React.FormEvent) =>{
    e.preventDefault();
  

    try{

      const response = await authService.login(credentials);

      if(!response.role){
        throw new Error('Role information not available');
      }

        add({
            name:'login-success',
            title:'Успешный вход',
            content:'Вы успешно авторизировались в системе',
            theme:'success',
            autoHiding:5000,
        });

        router.navigate({
            to:getRouteByRole(response.role.name),
            replace:true,
        })

    }catch(err){
        setError('Неверные данные или проблемы с сервером');
          add({
        name: 'login-error',
        title: 'Ошибка входа',
        content: 'Проверьте правильность введенных данных',
        theme: 'danger',
        autoHiding: 5000,
      });
        console.error('Login error:',err)
    }finally{
        setIsLoading(false);
    }
  };

  const getRouteByRole = (role:string) =>{
    console.log('Current role:',role)
    switch(role){
      case 'Центр Управления Полётами': return '/admin';
      case 'Командир Экипажа': return '/commander';
      case 'Бортовой Инженер': return '/engineer';
      case 'Космонавт': return '/astronaut';
      case 'Наземный Персонал': return '/ground';
      default: return '/';
    }
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {id,value} = e.target;
    setCredentials(prev=>({
      ...prev,
      [id]:value
    }))
  }

  return(
      <MotionDiv>
        <Card view="raised" className="p-6" style={{padding:'32px'}}>
          <Text variant="header-2" className="mb-6 text-center">
            Вход в систему управления
          </Text>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mb-4"
            >
              <Text color="danger">{error}</Text>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Container>
              <CustomLabel className="block text-sm font-medium text-gray-700 mb-2 tracking-wide">
                Имя пользователя
              </CustomLabel>
              <TextInput
                id="username"
                type="text"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Введите имя пользователя"
                size="l"
              />
            </Container>
            
            <Container>
              <CustomLabel className="mb-1">
                Пароль
              </CustomLabel>
              <TextInput
                id="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Введите пароль"
                size="l"
                
              />
            </Container>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                view="action"
                type="submit"
                loading={isLoading}
                size="l"
                width="max"
                pin="round-round"
                style={{marginTop:7}}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </motion.div>
          </form>
        </Card>
      </MotionDiv>
  )
}

interface CustomLabelProps{
  children:ReactNode;
  htmlFor?:string;
  className?:string;
}

const CustomLabel= ({children,htmlFor,className = ""}:CustomLabelProps) =>{
  return(
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 tracking-wide ${className}`} style={{paddingTop:12}}>
      {children}
    </label>
  )
}

interface MotionDivProps{
  style?:CSSProperties;
  children:ReactNode;
}

const MotionDiv = ({style,children}:MotionDivProps) =>{
  return(
    <motion.div style={style} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
    >
      {children}
    </motion.div>
  )
}

interface ContainerProps{
  children:ReactNode;
}

const Container = ({children}:ContainerProps)=>(
  <div style={{marginTop:12}}>
    {children}
  </div>
)
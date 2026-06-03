import { AnimatePresence } from 'motion/react';
import { Route, Switch, useLocation } from 'wouter';
import { FloatingHearts } from '@/components/FloatingHearts';
import { Layout } from '@/components/Layout';
import { PageTransition } from '@/components/PageTransition';
import { Petals } from '@/components/Petals';
import { DatePage } from '@/pages/DatePage';
import { FoodPage } from '@/pages/FoodPage';
import { HomePage } from '@/pages/HomePage';
import { LetterPage } from '@/pages/LetterPage';
import { YayPage } from '@/pages/YayPage';

export default function App() {
  const [location] = useLocation();
  const isLetter = location === '/letter';

  return (
    <Layout background={<Petals />} foreground={isLetter ? <FloatingHearts /> : null}>
      <AnimatePresence mode="wait">
        <PageTransition key={location}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/yay" component={YayPage} />
            <Route path="/date" component={DatePage} />
            <Route path="/food" component={FoodPage} />
            <Route path="/letter" component={LetterPage} />
            <Route>
              <HomePage />
            </Route>
          </Switch>
        </PageTransition>
      </AnimatePresence>
    </Layout>
  );
}

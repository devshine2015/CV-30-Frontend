import React from 'react';
import { default as EventTickets } from './event-tickets.js';
import { default as ChildrenCare } from './children-care.js';
import { default as PrivateClinic } from './private-clinic.js';
import { default as Coaching } from './coaching.js';
import { default as Coffee } from './coffee.js';
import { default as CommutingSubsidy } from './commuting-subsidy.js';
import { default as CompanyCar } from './company-car.js';
import { default as CompanyLaptop } from './company-laptop.js';
import { default as CompanyPhone } from './company-phone.js';
import { default as Dentist } from './dentist.js';
import { default as DisabilityInsurance } from './disability-insurance.js';
import { default as ElderCare } from './elder-care.js';
import { default as FamilyBenefits } from './family-benefits.js';
import { default as FreeBooks } from './free-books.js';
import { default as Games } from './games.js';
import { default as GymMembership } from './gym-membership.js';
import { default as Housing } from './housing.js';
import { default as InternationalExperiences } from './international-experiences.js';
import { default as LifeInsurance } from './life-insurance.js';
import { default as MealCoupons } from './meal-coupons.js';
import { default as OneDayOff } from './one-day-off.js';
import { default as PaidMaternity } from './paid-maternity.js';
import { default as PaidVacations } from './paid-vacations.js';
import { default as Playground } from './playground.js';
import { default as ProfessionalDevProgram } from './professional-dev-program.js';
import { default as ProfitSharing } from './profit-sharing.js';
import { default as FlexibleWorkingHours } from './flexible-working-hours.js';
import { default as RelaxArea } from './relax-area.js';
import { default as RelocationExpenses } from './relocation-expenses.js';
import { default as SabaticLeave } from './sabatic-leave.js';
import { default as Snacks } from './snacks.js';
import { default as StockOption } from './stock-option.js';
import { default as TeamBondingEvents } from './team-bonding-events.js';
import { default as Trainings } from './trainings.js';
import { default as TuitionReimbursment } from './tuition-reimbursment.js';

const icons = {
    'event-tickets': EventTickets,
    'children-care': ChildrenCare,
    'private-clinic': PrivateClinic,
    'coaching': Coaching,
    'coffee': Coffee,
    'commuting-subsidy': CommutingSubsidy,
    'company-car': CompanyCar,
    'company-laptop': CompanyLaptop,
    'company-phone': CompanyPhone,
    'dentist': Dentist,
    'disability-insurance': DisabilityInsurance,
    'elder-care': ElderCare,
    'family-benefits': FamilyBenefits,
    'free-books': FreeBooks,
    'games': Games,
    'gym-membership': GymMembership,
    'housing': Housing,
    'international-experiences': InternationalExperiences,
    'life-insurance': LifeInsurance,
    'meal-coupons': MealCoupons,
    'one-day-off': OneDayOff,
    'paid-maternity': PaidMaternity,
    'paid-vacations': PaidVacations,
    'playground': Playground,
    'professional-dev-program': ProfessionalDevProgram,
    'profit-sharing': ProfitSharing,
    'flexible-working-hours': FlexibleWorkingHours,
    'relax-area': RelaxArea,
    'relocation-expenses': RelocationExpenses,
    'sabatic-leave': SabaticLeave,
    'snacks': Snacks,
    'stock-option': StockOption,
    'team-bonding-events': TeamBondingEvents,
    'trainings': Trainings,
    'tuition-reimbursment': TuitionReimbursment,
}

export default ({ icon, size, fill, style }) => {
    const IconComponent = icons[icon];
    return <IconComponent width={size} height={size} fill={fill} style={style} />
}
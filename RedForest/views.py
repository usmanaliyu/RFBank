from django.shortcuts import render,get_object_or_404
from django.contrib import messages


# Create your views here.
def home(request):
    return render(request,'index.html')

######## PRIVATE BANKING######
def privatebanking(request):
    return render(request,'private-banking.html')

def investmentsolutions(request):
    return render (request,'private-banking/investment-solutions.html')
def advisorysolutions(request):
    return render(request,'private-banking/investment-solutions/advisory-solutions.html')
def discretionarymandates(request):
    return render(request,'private-banking/investment-solutions/discretionary-mandates.html')
def alternativeandprivatemarketinvestment(request):
    return render(request,'private-banking/investment-solutions/alternative-and-private-market-investments.html')
def advancedinvestmentsolutions(request):
    return render(request,'private-banking/investment-solutions/advanced-investment-solutions.html')

def wealthservices(request):
    return render(request, 'private-banking/wealth-services.html')
def wealthsolutions(request):
    return render(request,'private-banking/wealth-services/wealth-solutions.html')
def wealthplanning(request):
    return render(request,'private-banking/wealth-services/wealth-planning.html')
def fundservices(request):
    return render(request,'private-banking/wealth-services/fund-services.html')
def  trustservices(request):
    return render(request, 'private-banking/wealth-services/trust-services.html')


def creditandfinancing(request):
    return render(request,'private-banking/credit-and-financing.html')

def bankingservices(request):
    return render(request,'private-banking/banking-services.html')

def independentassetmanagers(request):
    return render(request, 'private-banking/independent-asset-managers.html')

def ebanking(request):
    return render(request,'private-banking/ebanking.html')
def rfbbanking(request):
    return render(request,'private-banking/ebanking/rfb-mobile-banking.html')
def rfbaccess(request):
    return render(request,'private-banking/ebanking/rfb-access.html')
def security(request):
    return render(request,'private-banking/ebanking/security.html')
def documentation(request):
    return render(request,'private-banking/ebanking/documentation.html')

######### ASSET MANAGEMENT #############

def assetmanagement(request):
    return render(request,'asset-management.html')
def investmentprocess(request):
    return render(request,'asset-management/investment-process.html')
def responsibleinvesting(request):
    return render(request,'asset-management/responsible-investing.html')

######### INSIGHT ##########

def insights(request):
    return render(request,'insights.html')

######### ABOUT ##########

def about(request):
    return render(request,'about.html')

def ourphilosophy(request):
    return render(request,'about/our-philosophy.html')

def ourhistory(request):
    return render(request,'about/our-history.html')

def ourorganization(request):
    return render(request,'about/our-organization.html')
def globalbusinesscommittee(request):
    return render(request,'about/our-organization/global-business-committee.html')
def auditor(request):
    return render(request,'about/our-organization/auditor.html')
def regulations(request):
    return render(request, 'about/our-organization/regulations.html')

def ourlocations(request):
    return render(request,'about/our-locations.html')

def oursponsorships(request):
    return render(request,'about/our-sponsorships.html')
def sailing(request):
    return render(request,'about/our-sponsorships/sailing.html')
def jazz(request):
    return render(request,'about/our-sponsorships/jazz.html')
def artsandlifestyle(request):
    return render(request,'about/our-sponsorships/arts-and-lifestyle.html')
def talentdevelopment(request):
    return render(request,'about/our-sponsorships/talent-development.html')

def careers(request):
    return render(request,'about/careers.html')

def sustainability(request):
    return render(request,'about/sustainability.html')

############ IVESTORS ##########
def investors(request):
    return render(request,'investors.html')


def financialresults(request):
    return render(request,'investors/financial-results.html')
def finanacialcalenderandevents(request):
    return render(request,'investors/financial-calendar-and-events.html')
def presentations(request):
    return render(request,'investors/presentations.html')
def shareinformation(request):
    return render(request,'investors/share-information.html')
def annualgeneralmeeting(request):
    return render(request,'investors/annual-general-meeting.html')
def ratingsandinstruments(request):
    return render(request,'investors/rating-and-instruments.html')
def analystcoverage(request):
    return render(request,'investors/analyst-coverage.html')
def sharerepurchase(request):
    return render(request,'investors/share-repurchase.html')


########### CONTACT ###############

def contact(request):
    return render(request,'contact.html')


########## ARTICLES #############
def easttowest(request):
    return render(request,'easttowest.html')
def bankofengland(request):
    return render(request,'bankofengland.html')

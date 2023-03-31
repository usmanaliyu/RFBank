from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('private-banking/', views.privatebanking, name='privatebanking'),

    path('investment-solutions/', views.investmentsolutions, name='investmentsolutions'),
    path('advisory-solutions', views.advisorysolutions, name='advisorysolutions'),
    path('discretionary-mandates', views.discretionarymandates, name='discretionarymandates'),
    path('alternative-and-private-market-investment', views.alternativeandprivatemarketinvestment, name='alternativeandprivatemarketinvestment'),
    path('advanced-investment-solutions', views.advancedinvestmentsolutions, name='advancedinvestmentsolutions'),

    path('wealth-services', views.wealthservices, name='wealthservices'),
    path('wealth-solutions', views.wealthsolutions, name='wealthsolutions'),
    path('wealth-planning', views.wealthplanning, name='wealthplanning'),
    path('fund-services', views.fundservices, name='fundservices'),
    path('trust-services', views.trustservices, name='trustservices'),

    path('credit-and-financing', views.creditandfinancing, name='creditandfinancing'),

    path('banking-services', views.bankingservices, name='bankingservices'),

    path('independent-asset-managers', views.independentassetmanagers, name='independentassetmanagers'),

    path('ebanking', views.ebanking, name='ebanking'),
    path('rfb-banking', views.rfbbanking, name='rfbbanking'),
    path('rfb-access', views.rfbaccess, name='rfbaccess'),
    path('security', views.security, name='security'),
    path('documentation', views.documentation, name='documentation'),

    path('asset-management', views.assetmanagement, name='assetmanagement'),
    path('investment-process', views.investmentprocess, name='investmentprocess'),
    path('responsible-investing', views.responsibleinvesting, name='responsibleinvesting'),

    path('insights', views.insights, name='insights'),

    path('about', views.about, name='about'),

    path('our-philosophy', views.ourphilosophy, name='ourphilosophy'),

    path('our-history', views.ourhistory, name='ourhistory'),

    path('our-organization', views.ourorganization, name='ourorganization'),
    path('global-business-committee', views.globalbusinesscommittee, name='globalbusinesscommittee'),
    path('auditor', views.auditor, name='auditor'),
    path('regulations', views.regulations, name='regulations'),

    path('our-locations', views.ourlocations, name='ourlocations'),

    path('our-sponsorships', views.oursponsorships, name='oursponsorships'),
    path('sailing', views.sailing, name='sailing'),
    path('jazz', views.jazz, name='jazz'),
    path('arts-and-lifestyle', views.artsandlifestyle, name='artsandlifestyle'),
    path('talent-development', views.talentdevelopment, name='talentdevelopment'),

    path('careers', views.careers, name='careers'),

    path('sustainability', views.sustainability, name='sustainability'),

    path('investors', views.investors, name='investors'),

    path('financial-results', views.financialresults, name='financialresults'),
    path('finanacial-calender-and-events', views.finanacialcalenderandevents, name='finanacialcalenderandevents'),
    path('presentations', views.presentations, name='presentations'),
    path('share-information', views.shareinformation, name='shareinformation'),
    path('annual-generalmeeting', views.annualgeneralmeeting, name='annualgeneralmeeting'),
    path('ratingsandinstruments', views.ratingsandinstruments, name='ratingsandinstruments'),
    path('analyst-coverage', views.analystcoverage, name='analystcoverage'),
    path('share-repurchase', views.sharerepurchase, name='sharerepurchase'),

    path('contact', views.contact, name='contact'),

    path('easttowest', views.easttowest, name='easttowest'),
    path('bank-of-england-rate-hikes', views.bankofengland, name='bankofengland'),

]

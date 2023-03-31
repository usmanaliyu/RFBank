from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('my-accounts',views.myaccounts,name='myaccounts'),
    path('account-statement',views.accountstatement, name='accountstatement'),
    path('RFB-Transfer',views.rfbtransfer,name='rfbtransfer'),
    path('other-banks-transfer',views.otherbankstransfer,name='otherbankstransfer'),
    path('International-Transfer',views.internationaltransfer,name='internationaltransfer'),
    path('spend-analysis', views.spendanalysis, name='spendanalysis'),
    path('Cheque', views.Cheque, name='Cheque'),
    path('westernunioun', views.westernunioun, name='westernunioun'),
    path('loansummarry', views.loansummarry, name='loansummarry'),
    path('requestloan', views.requestloan, name='requestloan'),
    path('stopcheque', views.stopcheque, name='stopcheque'),
    path('preconfirmcheque', views.preconfirmcheque, name='preconfirmcheque'),
    path('viewclearingchequedebt', views.viewclearingchequedebt, name='viewclearingchequedebt'),
    path('Chequedept', views.Chequedept, name='Chequedept'),
    path('requestcheque', views.requestcheque, name='requestcheque'),
    path('cardreward', views.cardreward, name='cardreward'),
    path('requestcard', views.requestcard, name='requestcard'),
    path('stopcard', views.stopcard, name='stopcard'),
    path('selfservice', views.selfservice, name='selfservice'),
    path('Information-Update', views.informationupdate, name='informationupdate'),
    path('Password-Settings', views.passwordsettings, name='passwordsettings'),







]

<?php
class FeedbackController extends Project_Controller_Front{
	public function addAction(){
		$json = array();
		if (Indi::post()->captcha != $_SESSION['captcha']['feedback']) {
			$json['errors'][] = 'Вы ввели неправильный проверочный код';
		} else {
			$data = Indi::post();
			$data['date'] = date('Y-m-d');
			Indi::model('Feedback')->createRow($data)->save();
			$json['ok'] = 'Ваше сообщение отправлено';
		}
		die(json_encode($json));
	}
}
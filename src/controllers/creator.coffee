helloWidget = helloWidget || angular.module 'helloWidget', []

helloWidget.controller 'helloWidgetCreatorCtrl', ['$scope', ($scope) ->
	_qset = null

	$scope.title = ''
	$scope.questions = []
	$scope.currentQuestion = false
	$scope.randomize = false

	$scope.editingQuestion = ''
	$scope.editingAnswers = []
	$scope.answerLetters = ['A','B','C','D']

	$scope.initNewWidget = (widget) ->
		_buildDisplay 'New Widget Title', widget

	$scope.initExistingWidget = (title, widget, qset) ->
		_buildDisplay title, widget, qset

	$scope.onQuestionImportComplete = (questions) ->
		for question in questions
			$scope.addQuestion question
		$scope.$apply()

	_buildDisplay = (title, widget, qset) ->
		_qset        = qset
		$scope.title = title

		if _qset?
			$scope.questions = _qset.items
		else
			$scope.questions = []

		$scope.$apply()

	$scope.addQuestion = (question) ->
		throw Error 'A question is already selected!' if $scope.currentQuestion
		if $scope.questions.length > 2
			Materia.CreatorCore.alert '3 Question Limit', 'For this widget, you may create up to 3 questions.'
		else
			newQuestion = _newQuestion(question)
			$scope.questions.push newQuestion
			$scope.currentQuestion = newQuestion unless question

	$scope.selectQuestion = (question) ->
		return if $scope.currentQuestion
		$scope.currentQuestion = question

		$scope.editingQuestion = question.questions[0].text
		for answer in question.answers
			$scope.editingAnswers.push _newAnswer answer

	$scope.saveEdit = ->
		if _validateQuestion()
			$scope.currentQuestion.questions[0].text = $scope.editingQuestion
			$scope.currentQuestion.answers = $scope.editingAnswers
			delete $scope.currentQuestion.unsaved

			_clearQuestion()

	$scope.cancelEdit = ->
		$scope.deleteQuestion $scope.currentQuestion if $scope.currentQuestion.unsaved
		_clearQuestion()

	$scope.deleteQuestion = (question) ->
		question = $scope.currentQuestion unless question

		i = $scope.questions.indexOf $scope.currentQuestion

		_clearQuestion()

		$scope.questions.splice i, 1

	_clearQuestion = ->
		$scope.currentQuestion = false
		$scope.editingQuestion = ''
		$scope.editingAnswers = []

	_validateQuestion = ->
		if $scope.editingQuestion is ''
			Materia.CreatorCore.alert 'Blank Question', 'You can not have a blank question!'
			return false
		fullCredit = false
		for answer in $scope.editingAnswers
			if answer.text is ''
				Materia.CreatorCore.alert 'Blank Answer', 'You can not have a blank answer!'
				return false
			fullCredit = true if answer.value is 100

		unless fullCredit
			Materia.CreatorCore.alert 'No Correct Answer', 'You must have at least one correct answer worth 100% credit!'
			return false
		true

	$scope.addAnswer = ->
		throw Error 'Only four answers are allowed per question!' if $scope.editingAnswers.length > 3
		$scope.editingAnswers.push _newAnswer()

	$scope.removeAnswer = (index) ->
		$scope.editingAnswers.splice index, 1

	$scope.answerChecked = (answer) ->
		if answer.checked then answer.value = 100
		else answer.value = 0

	$scope.cleanAnswerValue = (answer) ->
		val = parseInt answer.value
		if val < 0 or isNaN val
			val = 0
		else if val > 100
			val = 100
		answer.value = val

	_newQuestion = (question) ->
		newQuestion =
			questions:[{text: ''}],
			answers: [],
			assets:  [],
			id:      '',
			type:    'MC',
			unsaved: true

		if question?
			newQuestion.questions = question.questions
			newQuestion.answers = question.answers
			newQuestion.id = question.id
			delete newQuestion.unsaved

		newQuestion

	_newAnswer = (answer) ->
		newAnswer =
			id:    '',
			text:  '',
			checked: false,
			value: 0

		if answer?
			newAnswer.id = answer.id
			newAnswer.text = answer.text
			newAnswer.value = answer.value
			newAnswer.checked = answer.value is 100

		newAnswer

	$scope.onSaveClicked = ->
		if _buildSaveData()
			Materia.CreatorCore.save $scope.title, JSON.parse(angular.toJson(_qset))
		else
			Materia.CreatorCore.cancelSave 'Widget not ready to save.'

	$scope.onSaveComplete = -> true

	_buildSaveData = ->
		okToSave = true

		# Create new qset object if we don't already have one, set default values regardless.
		unless _qset?
			_qset = {}
		_qset.options = {}
		_qset.assets = []
		_qset.rand = false
		_qset.options.randomize = $scope.randomize
		_qset.name = $scope.title
		# update our values
		okToSave = false if $scope.title is ''

		qList = $scope.questions
		qList.assets = []
		qList.options = {cid: 0}

		_qset.items = qList

		# go through all of the answers for each question and unset creator-specific properties
		for question, questionIndex in _qset.items
			for answer, answerIndex in question.answers
				delete answer.checked
				_qset.items[questionIndex].answers[answerIndex] = answer

		okToSave = false if _qset.items.length is 0
		okToSave

	Materia.CreatorCore.start $scope
]
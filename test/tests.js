/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
	'use strict';

	var subject, model, view;
	
	// Mise en place/configuration du model
	var setUpModel = function (todos) {
		model.read.and.callFake(function (query, callback) {
			callback = callback || query;
			callback(todos);
		});

		model.getCount.and.callFake(function (callback) {

			var todoCounts = {
				active: todos.filter(function (todo) {
					return !todo.completed;
				}).length,
				completed: todos.filter(function (todo) {
					return !!todo.completed;
				}).length,
				total: todos.length
			};

			callback(todoCounts);
		});

		model.remove.and.callFake(function (id, callback) {
			callback();
		});

		model.create.and.callFake(function (title, callback) {
			callback();
		});

		model.update.and.callFake(function (id, updateData, callback) {
			callback();
		});
	};

	var createViewStub = function () {
		var eventRegistry = {};
		return {
			render: jasmine.createSpy('render'),
			bind: function (event, handler) {
				eventRegistry[event] = handler;
			},
			trigger: function (event, parameter) {
				eventRegistry[event](parameter);
			}
		};
	};

	beforeEach(function () {
		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		view = createViewStub();
		subject = new app.Controller(model, view);
	});
	
	// On vérifie si les entrées sont bien affichées
	// Model et view 
	it('should show entries on start-up', function () {
		// TODO: write test
		// On commence avec une todo vide
		var todo = '';
		// On envoie la todo dans le model
		setUpModel([todo]);
		// Au départ de l'appli, on initalise la V à ''
		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
	});

	describe('routing', function () {
		
		// Afficher toutes les entrées sans route
		it('should show all entries without a route', function () {
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});
		
		// Afficher toutes les entrées sans toutes les routes 
		it('should show all entries without "all" route', function () {
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('#/');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});
		
		// Afficher les entrées active
		it('should show active entries', function () {
			// TODO: write test
			var todo = { 
				title: 'my todo', 
				completed: false
			};

			setUpModel([todo]);
			
			// Quand on affiche les todos actives, l'url affiche '#/active'
			subject.setView('#/active');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		// Afficher les entrées termineées
		it('should show completed entries', function () {
			// TODO: write test
			var todo = { 
				title: 'my todo', 
				completed: true
			};

			setUpModel([todo]);
			
			// Quand on affiche les todos terminées, l'url affiche '#/completed'
			subject.setView('#/completed');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});
	});
	
	// Afficher le bloc de contenu quand les todos existent 
	it('should show the content block when todos exists', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true
		});
	});
	
	// Cacher le bloc de contenu quand les todos n'existent pas
	it('should hide the content block when no todos exists', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false
		});
	});
	
	// Vérifier l'activation des boutons, si les todos sont terminées
	// OU
	// Vérifier la désactivation du bouton "all", si les todos sont terminées
	it('should check the toggle all button, if all todos are completed', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true
		});
	});

	// Régler le boutton "effacé terminé"
	it('should set the "clear completed" button', function () {
		var todo = {id: 42, title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true
		});
	});
	
	// Doit mettre en surbrillance le filtre "All" par défaut
	it('should highlight "All" filter by default', function () {
		// TODO: write test
		var todo = { 
			title: 'my todo', 
			completed: false
		};

		setUpModel([todo]);

		subject.setView('');
		
		/*
		Cela ne fonctionne pas, pourquoi ? 
		expect(view.render).toHaveBeenCalledWith('setFilter', {
			active: true
		});
		*/

		expect(view.render).toHaveBeenCalledWith('setFilter', '');
	});
	
	// Doit mettre en surbrillance le filtre "Active" lors du passage en vue active
	it('should highlight "Active" filter when switching to active view', function () {
		// TODO: write test
		var todo = { 
			title: 'my todo', 
			completed: false
		};

		setUpModel([todo]);

		subject.setView('#/active');
		
		/*
		Cela ne fonctionne pas, pourquoi ? 
		expect(view.render).toHaveBeenCalledWith('setFilter', {
			active: true 
		});
		*/

		expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
	});

	// Doit mettre en surbrillance le filtre "Completed" lors du passage en vue terminée
	it('should highlight "Completed" filter when switching to completed view', function () {
		// TODO: write test
		var todo = { 
			title: 'my todo', 
			completed: true
		};

		setUpModel([todo]);

		subject.setView('#/completed');

		expect(view.render).toHaveBeenCalledWith('setFilter', 'completed');
	});

	describe('toggle all', function () {

		// Devrait basculer tous les todos sur terminés
		it('should toggle all todos to completed', function () {
			// TODO: write test
			var todo = [
				{ 
					id: 1, 
					title: 'my todo 1', 
					completed: false
				}, 
				{ 
					id: 2, 
					title: 'my todo 2', 
					completed: false
				}
			];

			setUpModel([todo]);

			subject.setView('');
			
			view.trigger('toggleAll', { completed: true });

			/* */

		});
		
		// Mettre à jour la vue
		it('should update the view', function () {
			// TODO: write test
			var todo = [
				{ 
					id: 1, 
					title: 'my todo 1', 
					completed: false
				},
				{ 
					id: 2, 
					title: 'my todo 2', 
					completed: false
				}
			];
			
			// Cela ne fonctionne pas, pourquoi ? 
			// setUpModel([todo]);
			setUpModel(todo);

			subject.setView('');

			view.trigger('toggleAll', { completed: true });
			
			// Cela ne fonctionne pas, pourquoi ? 
			// expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 1, title: 'my todo 1', completed: true });
			// expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 2, title: 'my todo 2', completed: true });
			expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 1, completed: true });
			expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 2, completed: true });
			
		});
	});

	describe('new todo', function () {
		
		// Ajouter une nouvelle todo au model
		it('should add a new todo to the model', function () {
			// TODO: write test
			setUpModel([]);

			subject.setView('');
			
			// Evènement clic sur newTodo
			view.trigger('newTodo', 'a new todo');

			// expect(model.create).toHaveBeenCalled();
			// expect(model.create).toHaveBeenCalledWith('a new todo', function(){} );
			expect(model.create).toHaveBeenCalledWith('a new todo', jasmine.any(Function) );
		});

		// Ajouter une nouvelle todo à la vue
		it('should add a new todo to the view', function () {
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake(function (callback) {
				callback([{
					title: 'a new todo',
					completed: false
				}]);
			});

			view.trigger('newTodo', 'a new todo');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [{
				title: 'a new todo',
				completed: false
			}]);
		});

		// Effacer le champ de saisie lorsqu'une nouvelle todo est ajoutée
		it('should clear the input field when a new todo is added', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(view.render).toHaveBeenCalledWith('clearNewTodo');
		});
	});

	describe('element removal', function () {

		// Supprimer une entrée du model
		it('should remove an entry from the model', function () {
			// TODO: write test
			var todo = {
				id: 1, 
				title: 'my todo', 
				completed: true
			};

			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemRemove', {id: 42});

			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});
		
		// Supprimer une entrée de la vue
		it('should remove an entry from the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
		
		// Mettre à jour le nombre d'éléments
		it('should update the element count', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
		});
	});

	describe('remove completed', function () {

		// Supprimer une entrée terminée du model
		it('should remove a completed entry from the model', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		// Supprimer une entrée terminée de la vue
		it('should remove a completed entry from the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle', function () {

		// Mettre à jour le model
		it('should update the model', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 21, completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		// Mettre à jour la vue
		it('should update the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 42, completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('edit item', function () {

		// Passer en mode édition
		it('should switch to edit mode', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEdit', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItem', {id: 21, title: 'my todo'});
		});
		
		// Quitter le mode d'édition à la fin de l'opération
		it('should leave edit mode on done', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'new title'});
		});
		
		// Persister dans les changements apportés à la fin de l'opération
		it('should persist the changes on done', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(model.update).toHaveBeenCalledWith(21, {title: 'new title'}, jasmine.any(Function));
		});
		
		// Supprimer l'élément du modèle lorsqu'un titre vide persiste
		it('should remove the element from the model when persisting an empty title', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		// Supprimer l'élément de la vue lorsqu'un titre vide persiste
		it('should remove the element from the view when persisting an empty title', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		// Quitter le mode édition au moment de l'annulation 
		it('should leave edit mode on cancel', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'my todo'});
		});

		// Ne pas persister dans les changements en cas d'annulation
		it('should not persist the changes on cancel', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(model.update).not.toHaveBeenCalled();
		});
	});

});
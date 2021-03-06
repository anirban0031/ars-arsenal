import React from 'react'
import Picker from '../picker'
import { mount } from 'enzyme'

jest.useFakeTimers()

describe('Picker', () => {
  let component = null

  function clickGalleryItem(index) {
    component
      .find('Gallery .ars-gallery-item button')
      .at(index)
      .simulate('click')
  }

  describe("when a picker's search input is changed", () => {
    test('updates its search state', () => {
      let component = mount(<Picker url="test.json" />)

      component.find('Search input').simulate('change', {
        target: { value: 'test' }
      })

      jest.runAllTimers()

      expect(component).toHaveState('search', 'test')
    })
  })

  describe("when a picker's gallery has a selection", () => {
    beforeEach(() => {
      component = mount(<Picker url="test.json" />)

      jest.runAllTimers()
      component.update()

      component
        .find('.ars-gallery-item button')
        .first()
        .simulate('click')
    })

    test('updates its picked state', () => {
      expect(component).toHaveState('picked', [0])
    })
  })

  describe("when a multiselect picker's gallery has a selection", () => {
    beforeEach(() => {
      component = mount(<Picker url="test.json" multiselect={true} />)
      jest.runAllTimers()
      component.update()
    })

    test('updates its picked state', () => {
      clickGalleryItem(0)
      expect(component).toHaveState('picked', [0])
    })

    test('adds to its picked state', () => {
      clickGalleryItem(0)
      clickGalleryItem(1)
      expect(component).toHaveState('picked', [0, 1])
    })

    test('removes its picked state', () => {
      clickGalleryItem(0)
      clickGalleryItem(1)
      clickGalleryItem(1)
      expect(component).toHaveState('picked', [0])
    })
  })

  describe("when a picker's clear selection button is clicked", () => {
    beforeEach(() => {
      component = mount(<Picker url="test.json" />)
      component.setState({ picked: [0] })
      jest.runAllTimers()
      component.update()
    })

    test('clears its picked state', () => {
      component
        .find('.ars-dialog-footer Button.ars-dialog-clear')
        .simulate('click')

      expect(component).toHaveState('picked', [])
    })
  })

  describe("when a picker's confirm button is clicked", () => {
    beforeEach(() => {
      component = mount(
        <Picker url="test.json" onExit={jest.fn()} onChange={jest.fn()} />
      )

      component
        .find('.ars-dialog-confirm')
        .last()
        .simulate('click')
    })

    test('triggers the exit callback', () => {
      expect(component.prop('onExit')).toHaveBeenCalled()
    })

    test('triggers the onChange callback', () => {
      expect(component.prop('onChange')).toHaveBeenCalled()
    })
  })

  describe("when a picker's cancel button is clicked", () => {
    let component, onChange, onExit

    beforeEach(() => {
      onExit = jest.fn()
      onChange = jest.fn()
      component = mount(
        <Picker url="test.json" onExit={onExit} onChange={onChange} />
      )
      component
        .find('.ars-dialog-cancel')
        .last()
        .simulate('click')
    })

    test('triggers the exit callback', () => {
      expect(onExit).toHaveBeenCalled()
    })

    test('does not trigger the onChange callback', () => {
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('when a user pushes a key sequence in the gallery', () => {
    describe('and it is cmd+enter', () => {
      let component = null

      beforeEach(() => {
        component = mount(
          <Picker url="test.json" onExit={jest.fn()} onChange={jest.fn()} />
        )

        jest.runAllTimers()
        component.update()

        component.find('Gallery').simulate('keyDown', {
          key: 'Enter',
          metaKey: true
        })
      })

      test('triggers the exit callback', () => {
        expect(component.prop('onExit')).toHaveBeenCalled()
      })

      test('trigger the onChange callback', () => {
        expect(component.prop('onChange')).toHaveBeenCalled()
      })
    })

    describe('and it is ctrl+enter', () => {
      let component = null

      beforeEach(() => {
        component = mount(
          <Picker url="test.json" onExit={jest.fn()} onChange={jest.fn()} />
        )

        jest.runAllTimers()
        component.update()

        component.find('Gallery').simulate('keydown', {
          key: 'Enter',
          ctrlKey: true
        })
      })

      test('triggers the exit callback', () => {
        expect(component.prop('onExit')).toHaveBeenCalled()
      })

      test('trigger the onChange callback', () => {
        expect(component.prop('onChange')).toHaveBeenCalled()
      })
    })

    describe('and it does not include an option key', () => {
      let component = null

      beforeEach(() => {
        component = mount(
          <Picker url="test.json" onExit={jest.fn()} onChange={jest.fn()} />
        )

        jest.runAllTimers()
        component.update()

        component.find('Gallery').simulate('keydown', {
          key: 'Enter'
        })
      })

      test('does not trigger the exit callback', () => {
        expect(component.prop('onExit')).not.toHaveBeenCalled()
      })

      test('does not trigger the onChange callback', () => {
        expect(component.prop('onChange')).not.toHaveBeenCalled()
      })
    })

    describe('when given an error', () => {
      let component = null

      beforeAll(() => {
        component = mount(<Picker url="missing.json" />)
        jest.runAllTimers()
        component.update()
      })

      test('displays the error', () => {
        expect(component.find('.ars-error').text()).toContain(
          'Unable to load URL'
        )
      })
    })
  })
})

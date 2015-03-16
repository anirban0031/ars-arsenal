/**
 * Figure
 * An individual gallery tile
 */

import React from 'react'
import Image from './ui/image'
import Ink   from 'react-ink'

let cx    = require('classnames')

let Figure = React.createClass({

  propTypes: {
    record  : React.PropTypes.object.isRequired,
    onClick : React.PropTypes.func.isRequired,
    picked  : React.PropTypes.bool
  },

  render() {
    let { record, picked } = this.props

    let className = cx({
      'ars-fig'        : true,
      'ars-fig-picked' : picked
    })

    return (
      <button className={ className } onClick={ this._onClick }>
        <Image className="ars-fig-img" src={ record.url } />
        <span className="ars-fig-caption">
          { record.name }
        </span>
        <Ink opacity={ 0.4 } />
      </button>
    )
  },

  _onClick(e) {
    e.preventDefault()
    this.props.onClick(this.props.record.id)
  }

})

export default Figure
